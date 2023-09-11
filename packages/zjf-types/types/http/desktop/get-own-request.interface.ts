import { IDesktopQueueHistory } from "../../entities/desktop-queue-history.interface";
import { IDesktopQueue } from "../../entities/desktop-queue.interface";
import { IDesktop } from "../../entities/desktop.interface";
import { IBasicResponse } from "../basic.interface";

export interface IGetOwnDesktopReqResData {
  /** 当前的云桌面申请，当状态为 待审核｜排队中｜使用中 时存在  */
  queue?: IDesktopQueue

  /** 排在当前用户前的人数 */
  queueLength?: number

  /** 当前用户最近一次被驳回的申请信息，当 `queue` 存在时，该字段不存在 */
  lastRejected?: IDesktopQueueHistory

  /** 用户上一次过期的云桌面，与 `lastRejected` 二选一 */
  lastExpired?: IDesktop
}

export interface IGetOwnDesktopReqResDto extends IBasicResponse<IGetOwnDesktopReqResData> {}