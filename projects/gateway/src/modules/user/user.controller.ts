import { objectOmit } from '@catsjuice/utils'
import type { User } from 'src/entities/user'
import { IsLogin } from 'src/guards/login.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'
import { Body, Controller, Get, Put, Query, Req } from '@nestjs/common'
import { emailAccountAtLeastOne } from 'src/utils/validator/account-phone-at-least-one'

import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'
import { UserService } from './user.service'
import { UserProfileResponseDto } from './dto/user.res.dto'
import { CreateUserResDto } from './dto/create-user.res.dto'
import { CreateUserBodyDto } from './dto/create-user.body.dto'
import { GetProfileOwnQueryDto } from './dto/get-profile-own.query.dto'

@ApiTags('User | 用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly _userSrv: UserService,
  ) {}

  @ApiOperation({ summary: '创建一个新用户' })
  @ApiSuccessResponse(CreateUserResDto)
  @Put('create')
  public async createUser(@Body() body: CreateUserBodyDto) {
    emailAccountAtLeastOne(body)
    return await this._userSrv.insertUser(body)
  }

  @ApiOperation({ summary: '获取当前登录用户的信息' })
  @ApiSuccessResponse(UserProfileResponseDto)
  @IsLogin()
  @Get('profile/own')
  public async getOwnProfile(
    @Query() query: GetProfileOwnQueryDto,
    @Req() req: FastifyRequest,
  ) {
    const omitFields: Array<keyof User> = ['password', 'isDeleted', 'isSysAdmin']
    if (!query.relation) {
      return objectOmit(
        (req.raw?.user || {}) as User, omitFields,
      )
    }
    try {
      const user = await this._userSrv.findById(req.raw?.user?.id, {
        relations: query.relation as any,
      })
      return objectOmit(user, omitFields)
    }
    catch (err) {
      const sqlError = parseSqlError(err)
      if (sqlError === SqlError.ENTITY_PROPERTY_NOT_FOUND) {
        responseParamsError([{
          property: 'relation',
          constraints: { relation: '关联信息有误' },
        }])
      }

      throw err
    }
  }
}
