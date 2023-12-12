import { ErrorCode } from 'zjf-types'
import { User } from 'src/entities/user'
import { Injectable } from '@nestjs/common'
import { objectPick } from '@catsjuice/utils'
import { ConfigService } from '@nestjs/config'
import { mergeDeep } from 'src/utils/mergeDeep'
import type { OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { responseError } from 'src/utils/response'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { encryptPassword } from 'src/utils/encrypt/encrypt-password'

import type {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm'
import {
  In,
  Not,
  Repository,
} from 'typeorm'
import type { SysAdmin } from 'src/config/_sa.config'

const defaultQueryUserOptions = {
  where: { isDeleted: false, isSysAdmin: false },
}

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,
    private readonly _cfgSrv: ConfigService,
  ) {}

  onModuleInit() {
    this.initSysAdmin()
  }

  public async initSysAdmin() {
    const superAdminList = this._cfgSrv.get<SysAdmin[]>('sa.list')
    // 删除无效的超级管理员
    await this._userRepo.delete({
      isSysAdmin: true,
      account: Not(In(superAdminList.map(sa => sa.account))),
    })

    // 添加新的超级管理员
    for (const sa of superAdminList) {
      try {
        await this._userRepo.save({
          account: sa.account,
          password: await encryptPassword(sa.password),
          isSysAdmin: true,
        })
      }
      catch (err) {
        await this._userRepo.update({ account: sa.account }, {
          password: await encryptPassword(sa.password),
          isSysAdmin: true,
        })
      }
    }
  }

  /**
   * 查找指定 id 的用户
   * @param id
   * @param options
   * @returns
   */
  public async findById(id: string, options?: FindManyOptions<User>) {
    const defaultOptions: FindOneOptions<User> = {}
    const requiredOptions: FindOneOptions<User> = {
      where: { id },
    }
    return this._userRepo.findOne(
      mergeDeep(defaultOptions, options, requiredOptions),
    )
  }

  /** 自定义查询单个用户 */
  public async queryUser(options: FindOneOptions<User>) {
    const defaultOptions: FindOneOptions<User> = {
      ...defaultQueryUserOptions,
    }
    return this._userRepo.findOne(mergeDeep(defaultOptions, options))
  }

  /** 自定义查询用户列表 */
  public async queryUsers(options: FindManyOptions<User>) {
    const defaultOptions: FindManyOptions<User> = {
      ...defaultQueryUserOptions,
    }
    return this._userRepo.find(mergeDeep(defaultOptions, options))
  }

  /**
   * 创建一个用户
   * @param user
   * @returns
   */
  public async insertUser(user: Partial<User>) {
    try {
      return await this._userRepo.save(
        await this._userRepo.create({
          ...user,
          password: user.password ? await encryptPassword(user.password) : null,
        }),
      )
    }
    catch (err) {
      const error = parseSqlError(err)
      if (error === SqlError.DUPLICATE_ENTRY) {
        const value = err.message.match(/Duplicate entry\s+'(.*?)'/)?.[1]
        if (value === user.account)
          responseError(ErrorCode.USER_ACCOUNT_REGISTERED)
        else if (value === user.email)
          responseError(ErrorCode.USER_EMAIL_REGISTERED)
      }
      throw err
    }
  }

  /**
   * 更新指定用户的邮箱
   * @param id
   * @param newEmail
   * @returns
   */
  public async updateUserEmail(id: User['id'], newEmail: string) {
    try {
      await this._userRepo.update({ id }, { email: newEmail })
      return true
    }
    catch (err) {
      const sqlError = parseSqlError(err)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.AUTH_EMAIL_REGISTERED)
    }
  }

  /**
   * 更新某个用户的密码
   * @param id
   * @param newPassword
   */
  public async updateUserPassword(
    where: FindOptionsWhere<User> | string | number,
    newPassword: string,
  ) {
    await this._userRepo.update(where, {
      password: await encryptPassword(newPassword),
    })
  }

  /**
   * 更新某个用户的基础信息
   * @param where
   * @param newBasicInfo
   */
  public async updateUserBasicInfo(
    where: FindOptionsWhere<User> | string | number,
    newBasicInfo: Partial<User>,
  ) {
    const allowedKeys: (keyof User)[] = ['avatar', 'nickname']
    const filteredBasicInfo = objectPick(newBasicInfo, allowedKeys, true)
    const updateRes = await this._userRepo.update(where, filteredBasicInfo)
    return updateRes.affected > 0
  }

  public qb(alias = 'u') {
    return this._userRepo.createQueryBuilder(alias)
  }

  public repo() {
    return this._userRepo
  }
}
