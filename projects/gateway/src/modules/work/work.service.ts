import { Repository } from 'typeorm'
import { Work } from 'src/entities/work'
import { Injectable } from '@nestjs/common'
import type { User } from 'src/entities/user'
import { InjectRepository } from '@nestjs/typeorm'

import { responseError } from 'src/utils/response'
import { ErrorCode } from 'zjf-types'
import { FileService } from '../file/file.service'
import { timestampFilename } from '../../utils/timestamp-filename'

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private readonly _workRepo: Repository<Work>,
    private readonly _fileSrv: FileService,
  ) {}

  public async upload({ user, file, title, author, filename }: {
    user: User
    file: any
    title: string
    author: string
    filename: string
  }) {
    const uniqueFilename = timestampFilename(filename)
    const path = `work/${user.id}/${uniqueFilename}`
    const work = this._workRepo.create({
      userId: user.id,
      filename: uniqueFilename,
      title,
      author,
    })
    await this._fileSrv.upload('pri', path, file)
    await this._workRepo.save(work)
    return work
  }

  public async download(id: string) {
    const record = await this._workRepo.findOne({ where: { id } })
    if (!record)
      responseError(ErrorCode.FILE_NOT_FOUND)
    const path = `work/${record.userId}/${record.filename}`
    return {
      stream: await this._fileSrv.download('pri', path),
      filename: record.filename,
    }
  }

  public async delete(record) {
    const path = `work/${record.userId}/${record.filename}`
    await this._fileSrv.delete('pri', path)
    const deleteRes = await this._workRepo.delete({ id: record.id })
    return deleteRes.affected > 0
  }

  public async update({ record, file, title, author, filename }: {
    record: Work
    file: any
    title: string
    author: string
    filename: string
  }) {
    if (title)
      record.title = title
    if (author)
      record.author = author
    if (file) {
      const oldFilename = record.filename
      await this._fileSrv.delete('pri', `work/${record.userId}/${oldFilename}`)
      const newFilename = timestampFilename(filename)
      const path = `work/${record.userId}/${newFilename}`
      await this._fileSrv.upload('pri', path, file)
      record.filename = newFilename
    }
    return await this._workRepo.save(record)
  }

  repo() {
    return this._workRepo
  }
}
