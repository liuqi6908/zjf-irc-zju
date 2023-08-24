import type { Buffer } from 'node:buffer'
import { formatFileSize } from 'zjf-utils'
import { Injectable } from '@nestjs/common'
import type { User } from 'src/entities/user'
import { codeTag } from 'src/utils/html/code'
import { MoreThan, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { responseError } from 'src/utils/response'
import { FileExportLarge } from 'src/entities/export/file-export-large.entity'
import { FileExportSmall } from 'src/entities/export/file-export-small.entity'
import { EXPORT_DFT_SM_DAILY_LIMIT, EXPORT_DFT_SM_SIZE_LIMIT, ErrorCode } from 'zjf-types'

import { EmailService } from '../email/email.service'
import { SysConfigService } from '../config/config.service'

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(FileExportLarge)
    private readonly _feLgRepo: Repository<FileExportLarge>,

    @InjectRepository(FileExportSmall)
    private readonly _feSmRepo: Repository<FileExportSmall>,

    private readonly _mailSrv: EmailService,
    private readonly _sysCfgSrv: SysConfigService,
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
      sizeLimit = EXPORT_DFT_SM_SIZE_LIMIT,
      dailyLimit = EXPORT_DFT_SM_DAILY_LIMIT,
    } = sysCfg?.export || {}
    // 检查文件尺寸
    if (fileSize > sizeLimit)
      responseError(ErrorCode.EXPORT_SIZE_LIMIT_EXCEEDED)

    // 检查当日的外发上限
    const todayZeroClock = new Date(new Date().setHours(0, 0, 0, 0))
    const count = await this._feSmRepo.count({
      where: { founderId: user.id, createdAt: MoreThan(todayZeroClock) },
    })

    // 外发次数超过上限
    if (count >= dailyLimit)
      responseError(ErrorCode.EXPORT_DAILY_LIMIT_EXCEEDED)

    const feSm = this._feSmRepo.create({
      founder: user,
      ip,
      fileName: filename,
      fileSize,
      note,
      email,
    })

    await this._sendEmailWithAttachment({
      email,
      user,
      note,
      filename,
      content: buffer,
      contentType,
      fileSize,
    })
    await this._feSmRepo.save(feSm)

    return feSm
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
  }) {
    const { email, user, note, filename, content, contentType, fileSize } = options
    const name = user.verification?.name || user.nickname || user.account || user.id
    const readableFileSize = formatFileSize(fileSize)

    let html = `<p>您好，${name}，您的文件已经外发成功，文件名为：
    ${codeTag(filename)}，文件大小为：${codeTag(readableFileSize)}</p>`

    if (note)
      html += `，备注信息为：<div style="padding: 5px;border-radius: 10px;color: #222">${note}</div>`

    await this._mailSrv.send({
      to: email,
      subject: 'ZJF Exporter',
      html,
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
