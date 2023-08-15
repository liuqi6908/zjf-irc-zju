import { PermissionType } from 'zjf-types'
import { ApiSuccessResponse } from 'src/utils/response'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'

import { DataPermissionService } from './data-permission.service'
import { DataRoleDetailResDto } from './dto/data-role-detail.res.dto'
import { UpsertDataRoleBodyDto } from './dto/upsert-data-role.body.dto'

@ApiTags('DataPermission | 数据权限管理')
@Controller('data-permission')
export class DataPermissionController {
  constructor(private readonly _dataPSrv: DataPermissionService) {}

  @ApiOperation({
    summary: '创建/更新数据下载角色',
    description: '数据角色名称为唯一标识，如果数据角色名称存在，则会更新角色信息',
  })
  @HasPermission([PermissionType.DATA_PERMISSION_CREATE, PermissionType.DATA_PERMISSION_UPDATE], 'AND')
  @Post('data-role/upsert')
  public async createRole(@Body() body: UpsertDataRoleBodyDto) {
    return await this._dataPSrv.upsertDataRole(body)
  }

  @ApiOperation({
    summary: '删除数据下载角色（同时删除绑定的 directory）',
    description: '删除数据下载角色，如果角色已关联用户，则会删除失败',
  })
  @ApiParam({ name: 'dataRoleName', description: '数据角色名称' })
  @HasPermission(PermissionType.DATA_PERMISSION_DELETE)
  @Delete('data-role/:dataRoleName')
  public async deleteRole(@Param('dataRoleName') dataRoleName: string) {
    return await this._dataPSrv.deleteRole(dataRoleName)
  }

  @ApiOperation({ summary: '列出所有数据下载角色' })
  @HasPermission(PermissionType.DATA_PERMISSION_QUERY)
  @ApiQuery({ name: 'permission', description: '是否关联查询所有的权限列表，传入任意值即可' })
  @Get('data-role/list')
  public async listDataRole(
    @Query('permission') permission: any,
  ) {
    return await this._dataPSrv.dataRoleRepo().find({
      relations: permission
        ? { downloadDirectories: true, viewDirectories: true }
        : {},
    })
  }

  @ApiOperation({ summary: '查询指定的数据下载角色详情' })
  @ApiSuccessResponse(DataRoleDetailResDto)
  @HasPermission(PermissionType.DATA_PERMISSION_QUERY)
  @Get('data-role/:dataRoleName')
  public async getDataRole(@Param('dataRoleName') dataRoleName: string) {
    return await this._dataPSrv.dataRoleRepo().findOne({
      where: { name: dataRoleName },
      relations: { downloadDirectories: true, viewDirectories: true },
    })
  }
}
