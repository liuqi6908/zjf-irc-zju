import { PermissionType } from 'zjf-types'

interface Nav {
  id: string
  name: string
  icon: string
  permission: PermissionType[]
}

export const navList: Nav[] = [
  {
    id: 'home',
    name: '页面管理',
    icon: 'fa fa-home',
    permission: [
      PermissionType.CMS_CREATE,
      PermissionType.CMS_UPDATE,
      PermissionType.CMS_DELETE,
    ],
  },
  {
    id: 'userAdmin',
    name: '用户管理',
    icon: 'fas fa-user',
    permission: [
      PermissionType.ACCOUNT_CREATE,
      PermissionType.ACCOUNT_DELETE,
      PermissionType.ACCOUNT_UPDATE,
      PermissionType.ACCOUNT_QUERY,
      PermissionType.VERIFICATION_LIST_ALL,
      PermissionType.VERIFICATION_CAT_ATTACHMENT,
      PermissionType.VERIFICATION_APPROVE,
      PermissionType.VERIFICATION_REJECT,
      PermissionType.VERIFICATION_CANCEL,
    ],
  },
  {
    id: 'dataAdmin',
    name: '数据管理',
    icon: 'fas fa-chart-bar',
    permission: [
      PermissionType.DATA_UPLOAD,
      PermissionType.DATA_UPLOAD_INTRO,
      PermissionType.DATA_UPLOAD_TABLE,
      PermissionType.DATA_EDIT_REFERENCE,
      PermissionType.DATA_QUERY_ALL,
      PermissionType.DATA_ROOT_CREATE,
      PermissionType.DATA_ROOT_UPDATE,
      PermissionType.DATA_ROOT_DELETE,
    ],
  },
  {
    id: 'logAdmin',
    name: '日志管理',
    icon: 'fas fa-clipboard-list',
    permission: [
      PermissionType.LOG_VIEW,
    ],
  },
  {
    id: 'authorityAdmin',
    name: '用户权限管理',
    icon: 'fas fa-address-card',
    permission: [
      PermissionType.ACCOUNT_UPDATE_DATA_ROLE,
      PermissionType.DATA_PERMISSION_CREATE,
      PermissionType.DATA_PERMISSION_UPDATE,
      PermissionType.DATA_PERMISSION_DELETE,
      PermissionType.DATA_PERMISSION_QUERY,
    ],
  },

  {
    id: 'desktopAdmin',
    name: '桌面管理',
    icon: 'fas fa-cloud',
    permission: [
      PermissionType.DESKTOP_REQUEST_CAT_ATTACHMENT,
      PermissionType.DESKTOP_REQUEST_CREATE,
      PermissionType.DESKTOP_REQUEST_APPROVE,
      PermissionType.DESKTOP_REQUEST_REJECT,
      PermissionType.DESKTOP_REQUEST_QUERY,
      PermissionType.DESKTOP_CREATE,
      PermissionType.DESKTOP_DISABLE,
      PermissionType.DESKTOP_UPDATE,
      PermissionType.DESKTOP_DELETE,
      PermissionType.DESKTOP_ASSIGN,
      PermissionType.DESKTOP_QUERY,
      PermissionType.DESKTOP_EXPIRE_CHECK,
    ],
  },
  {
    id: 'adminClient',
    name: '管理员分配',
    icon: 'fas fa-user-cog',
    permission: [
      PermissionType.ACCOUNT_UPDATE_ROLE,
      PermissionType.ROLE_CREATE,
      PermissionType.ROLE_UPDATE,
      PermissionType.ROLE_DELETE,
      PermissionType.ROLE_QUERY,
    ],
  },
  {
    id: 'workAdmin',
    name: '作品管理',
    icon: 'fas fa-book',
    permission: [
      PermissionType.WORK_QUERY_ALL,
      PermissionType.WORK_DOWNLOAD,
    ],
  },
  {
    id: 'requestPurchase',
    name: '申请采购',
    icon: 'fas fa-edit',
    permission: [
      PermissionType.DATA_SUGGEST_QUERY_ALL,
    ],
  },
  {
    id: 'exportFile',
    name: '文件外发',
    icon: 'fas fa-file-export',
    permission: [
      PermissionType.EXPORT_LG_QUERY_ALL,
      PermissionType.EXPORT_SM_QUERY_ALL,
      PermissionType.EXPORT_SM_DOWNLOAD,
      PermissionType.EXPORT_LG_APPROVE,
      PermissionType.EXPORT_LG_REJECT,
      PermissionType.EXPORT_LG_DOWNLOAD,
      PermissionType.CONFIG_UPDATE_EXPORT,
    ],
  },
]
