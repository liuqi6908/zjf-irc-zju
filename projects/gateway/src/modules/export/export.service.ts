import type { Buffer } from 'node:buffer'
import { Injectable } from '@nestjs/common'
import type { User } from 'src/entities/user'
import { objectOmit } from '@catsjuice/utils'
import { MoreThan, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { responseError } from 'src/utils/response'
import { readable2buffer } from 'src/utils/readable2buffer'
import { FileExportLarge } from 'src/entities/export/file-export-large.entity'
import { FileExportSmall } from 'src/entities/export/file-export-small.entity'

import {
  EXPORT_DFT_LG_SIZE_LIMIT,
  EXPORT_DFT_SM_DAILY_LIMIT,
  EXPORT_DFT_SM_SIZE_LIMIT,
  ErrorCode,
  FileExportLargeStatus,
} from 'zjf-types'
import { formatFileSize } from 'zjf-utils'
import { FileService } from '../file/file.service'
import { EmailService } from '../email/email.service'
import { NotifyService } from '../notify/notify.service'
import { SysConfigService } from '../config/config.service'
import { DesktopService } from '../desktop/desktop.service'
import { getFileExportSuccessHTML } from '../../utils/html/templates/file-export-success'

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(FileExportLarge)
    private readonly _feLgRepo: Repository<FileExportLarge>,

    @InjectRepository(FileExportSmall)
    private readonly _feSmRepo: Repository<FileExportSmall>,

    private readonly _fileSrv: FileService,
    private readonly _mailSrv: EmailService,
    private readonly _sysCfgSrv: SysConfigService,
    private readonly _desktopSrv: DesktopService,
    private readonly _notifySrv: NotifyService,
  ) {}

  /**
   * 小文件外发
   * @param options
   * @returns
   */
  public async exportSmall(options: {
    user: User
    ip: string
    filename: string
    fileSize: number
    note?: string
    buffer: Buffer
    contentType: string
  }) {
    const { user, ip, filename, fileSize, note, buffer, contentType } = options
    const email = user.email
    if (!email)
      responseError(ErrorCode.USER_EMAIL_NOT_EXISTS)

    const sysCfg = await this._sysCfgSrv.getConfig()
    const {
      sizeLimitSm = EXPORT_DFT_SM_SIZE_LIMIT,
      dailyLimit = EXPORT_DFT_SM_DAILY_LIMIT,
    } = sysCfg?.export || {}
    // 检查文件尺寸
    if (fileSize > sizeLimitSm)
      responseError(ErrorCode.EXPORT_SIZE_LIMIT_EXCEEDED)

    // 检查当日的外发上限
    const todayZeroClock = new Date(new Date().setHours(0, 0, 0, 0))
    const count = await this._feSmRepo.count({
      where: { founderId: user.id, createdAt: MoreThan(todayZeroClock) },
    })

    // 外发次数超过上限
    if (count >= dailyLimit)
      responseError(ErrorCode.EXPORT_DAILY_LIMIT_EXCEEDED)

    // 上传到 MinIO
    const year = new Date().getFullYear()
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0')
    const day = new Date().getDate().toString().padStart(2, '0')
    const arr = filename.split('.')
    const ext = arr.pop()
    const newFilename = `${arr.join('.')}-${Date.now()}.${ext}`
    const path = `export-sm/${user.id}/${year}/${month}/${day}/${newFilename}`

    const feSm = this._feSmRepo.create({
      founder: user,
      ip,
      fileName: filename,
      fileSize,
      note,
      email,
      path,
    })

    const [desktop] = await Promise.all([
      this._desktopSrv.findActiveDesktopByIP(ip),
      this._sendEmailWithAttachment({
        email,
        user,
        note,
        filename,
        content: buffer,
        contentType,
        fileSize,
        createdAt: feSm.createdAt,
      }),
      this._fileSrv.upload('pri', path, buffer),
    ])
    if (feSm)
      feSm.desktop = desktop
    await this._feSmRepo.save(feSm)
    return objectOmit(feSm, ['founder'])
  }

  /**
   * 大文件外发，上传到  MinIO ，管理员审核通过后再发送邮件
   * @param options
   */
  public async exportLarge(options: {
    user: User
    ip: string
    filename: string
    fileSize: number
    note?: string
    buffer: Buffer
    contentType: string
  }) {
    const { user, ip, filename, fileSize, note, buffer } = options
    const email = user.email
    if (!email)
      responseError(ErrorCode.USER_EMAIL_NOT_EXISTS)

    const sysCfg = await this._sysCfgSrv.getConfig()
    const { sizeLimitLg = EXPORT_DFT_LG_SIZE_LIMIT } = sysCfg?.export || {}
    // 检查文件尺寸
    if (fileSize > sizeLimitLg)
      responseError(ErrorCode.EXPORT_SIZE_LIMIT_EXCEEDED)

    const year = new Date().getFullYear()
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0')
    const day = new Date().getDate().toString().padStart(2, '0')
    const arr = filename.split('.')
    const ext = arr.pop()
    const newFilename = `${arr.join('.')}-${Date.now()}.${ext}`
    const path = `export/${user.id}/${year}/${month}/${day}/${newFilename}`
    const feLg = this._feLgRepo.create({
      email,
      fileName: filename,
      fileSize,
      founder: user,
      ip,
      note,
      path,
    })
    const [desktop] = await Promise.all([
      this._desktopSrv.findActiveDesktopByIP(ip),
      this._fileSrv.upload('pri', path, buffer),
    ])
    if (desktop)
      feLg.desktop = desktop
    await this._feLgRepo.save(feLg)
    this._notifySrv.notifyNewFileExportLg(feLg)
    return objectOmit(feLg, ['founder'])
  }

  /**
   * 通过一个大文件外发申请
   * @param id
   */
  public async approveLarge(id: string, handler: User) {
    const feLg = await this._feLgRepo.findOne({ where: { id } })
    if (!feLg)
      responseError(ErrorCode.EXPORT_NOT_EXISTS)
    if (feLg.status !== FileExportLargeStatus.Pending)
      responseError(ErrorCode.EXPORT_HANDLED)
    feLg.status = FileExportLargeStatus.Approved
    feLg.handler = handler
    feLg.handleAt = new Date()
    const readable = await this._fileSrv.download('pri', feLg.path)
    const content = await readable2buffer(readable)
    await this._sendEmailWithAttachment({
      content,
      contentType: 'application/octet-stream',
      email: feLg.email,
      filename: feLg.fileName,
      fileSize: feLg.fileSize,
      note: feLg.note,
      user: feLg.founder,
      createdAt: feLg.createdAt,
    })
    await this._feLgRepo.save(feLg)
    return {
      ...feLg,
      handler: objectOmit(feLg.handler, ['verification', 'password', 'role']),
    }
  }

  /**
   * 驳回一个大文件外发申请
   * @param id
   * @param reason
   */
  public async rejectLarge(id: string, handler: User, reason: string) {
    const feLg = await this._feLgRepo.findOne({ where: { id } })
    if (!feLg)
      responseError(ErrorCode.EXPORT_NOT_EXISTS)
    if (feLg.status !== FileExportLargeStatus.Pending)
      responseError(ErrorCode.EXPORT_HANDLED)

    feLg.status = FileExportLargeStatus.Rejected
    feLg.handler = handler
    feLg.handleAt = new Date()
    feLg.rejectReason = reason
    await this._feLgRepo.save(feLg)
    return {
      ...feLg,
      handler: objectOmit(feLg.handler, ['verification', 'password']),
    }
  }

  /**
   * 给指定的用户发送带附件的邮件
   * @param options
   */
  private async _sendEmailWithAttachment(options: {
    email: string
    user: User
    note?: string
    filename: string
    content: Buffer
    contentType: string
    fileSize: number
    createdAt?: Date | string
  }) {
    const { email, user, note, filename, content, contentType, fileSize, createdAt } = options
    // const name = user.verification?.name || user.nickname || user.account || user.id
    const readableFileSize = formatFileSize(fileSize)

    await this._mailSrv.send({
      to: email,
      ...getFileExportSuccessHTML({
        filename,
        note,
        createdAt,
        fileSize: readableFileSize,
      }),
      attachments: [{
        filename,
        content,
        contentType,
      }],
    })
  }

  smRepo() {
    return this._feSmRepo
  }

  lgRepo() {
    return this._feLgRepo
  }
}
