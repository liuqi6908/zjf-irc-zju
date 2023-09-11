import { Desktop } from 'src/entities/desktop'
import { SuccessDto } from 'src/dto/success.dto'
import { DesktopQueue } from 'src/entities/desktop-queue'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DesktopQueueHistory } from 'src/entities/desktop-queue-history'
import type { IGetOwnDesktopReqResData, IGetOwnDesktopReqResDto } from 'zjf-types'

export class GetOwnDesktopReqResData implements IGetOwnDesktopReqResData {
  @ApiPropertyOptional({
    description: '当前的云桌面申请，当状态为 待审核｜排队中｜使用中 时存在',
    type: () => DesktopQueue,
  })
  queue?: DesktopQueue

  @ApiProperty({
    description: '排在当前用户前的人数',
    type: Number,
  })
  queueLength?: number

  @ApiPropertyOptional({
    description: '当前用户最近一次被驳回的申请信息，当 `queue` 存在时，该字段不存在',
    type: () => DesktopQueueHistory,
  })
  lastRejected?: DesktopQueueHistory

  @ApiPropertyOptional({
    description: '用户上一次过期的云桌面，与 `lastRejected` 二选一',
    type: () => Desktop,
  })
  lastExpired?: Desktop
}

export class GetOwnDesktopReqResDto
  extends SuccessDto
  implements IGetOwnDesktopReqResDto {
  @ApiProperty({
    type: () => GetOwnDesktopReqResData,
  })
  data: GetOwnDesktopReqResData
}
