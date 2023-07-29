import { User } from 'src/entities/user'
import { Injectable } from '@nestjs/common'
import { objectKeys } from '@catsjuice/utils'
import { mergeDeep } from 'src/utils/mergeDeep'
import { InjectRepository } from '@nestjs/typeorm'
import { encryptPassword } from 'src/utils/encrypt/encrypt-password'

import type {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm'
import {
  In,
  Repository,
} from 'typeorm'

const defaultQueryUserOptions = {
  where: { isDeleted: false },
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,
  ) {}

  /**
   * 查找指定 id 的用户
   * @param id
   * @param options
   * @returns
   */
  public async findById(id: string, options?: FindManyOptions<User>) {
    const defaultOptions: FindOneOptions<User> = {
      ...defaultQueryUserOptions,
    }
    const requiredOptions: FindOneOptions<User> = {
      where: { id },
    }
    return this._userRepo.findOne(
      mergeDeep(defaultOptions, options, requiredOptions),
    )
  }

  /**
   * 查找指定 id 列表的用户
   * @param ids
   * @param options
   * @returns
   */
  public async findByIds(ids: string[], options?: FindManyOptions<User>) {
    const defaultOptions: FindManyOptions<User> = {
      ...defaultQueryUserOptions,
    }
    const requiredOptions: FindManyOptions<User> = {
      where: { id: In(ids) },
    }
    return this._userRepo.find(
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
    return await this._userRepo.save(
      await this._userRepo.create({
        ...user,
        password: await encryptPassword(user.password),
      }),
    )
  }

  /**
   * 删除指定的账户
   * @param where
   * @returns
   */
  public async deleteUser(where: FindOptionsWhere<User>) {
    await this._userRepo.update(where, {
      isDeleted: true,
      account: null,
      email: null,
    })
  }

  // TODO: 更新用户手机号
  /**
   * 更新指定用户的手机号
   */
  public async updateUserPhone() {
    throw new Error('Not implemented')
  }

  // TODO: 更新用户邮箱
  public async updateUserEmail() {
    throw new Error('Not implemented')
  }

  /**
   * 更新某个用户的密码
   * @param where
   * @param newPassword
   */
  public async updateUserPassword(
    where: FindOptionsWhere<User> | string | number | User,
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
    where: FindOptionsWhere<User> | string | number | User,
    newBasicInfo: Partial<User>,
  ) {
    const allowedKeys: (keyof User)[] = ['avatar', 'nickname']
    const filteredBasicInfo = objectKeys(newBasicInfo).reduce((acc, key) => {
      if (!allowedKeys.includes(key as keyof User))
        return acc
      return { ...acc, [key]: newBasicInfo[key] }
    }, {} as Partial<User>)
    await this._userRepo.update(where, filteredBasicInfo)
  }

  public qb(alias = 'u') {
    return this._userRepo.createQueryBuilder(alias)
  }
}
