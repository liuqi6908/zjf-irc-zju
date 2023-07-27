import { Body, Controller, Get, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { emailPhoneAtLeastOne } from 'src/utils/validator/email-phone-at-least-one'

import { UserService } from './user.service'
import { CreateUserBodyDto } from './dto/create-user.body.dto'

@ApiTags('User | 用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly _userSrv: UserService,
  ) {}

  @ApiOperation({ summary: '创建一个新用户' })
  @Put('create')
  public async createUser(
    @Body() body: CreateUserBodyDto,
  ) {
    emailPhoneAtLeastOne(body)
    return await this._userSrv.insertUser(body)
  }

  @ApiOperation({ summary: '获取个人信息' })
  @Get('profile/own')
  public async getOwnProfile() {
    // return aw
  }
}
