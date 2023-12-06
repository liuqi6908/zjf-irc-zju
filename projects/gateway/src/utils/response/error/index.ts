import _userErrors from './_user.error'
import _authErrors from './_auth.error'
import _fileErrors from './_file.error'
import _dataErrors from './_data.error'
import _commonError from './_common.error'
import _exportErrors from './_export.error'
import _suggestError from './_suggest.error'
import _desktopErrors from './_desktop.error'
import _permissionErrors from './_permission.error'
import _roleErrors from './_role.error'
import _verificationErrors from './_verification.error'

export const errorMessages: ErrorMessageCollection = {
  ..._dataErrors,
  ..._authErrors,
  ..._fileErrors,
  ..._userErrors,
  ..._commonError,
  ..._suggestError,
  ..._exportErrors,
  ..._desktopErrors,
  ..._permissionErrors,
  ..._roleErrors,
  ..._verificationErrors,
}
