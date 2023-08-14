import _userErrors from './_user.error'
import _authErrors from './_auth.error'
import _fileErrors from './_file.error'
import _commonError from './_common.error'
import _permissionErrors from './_permission.error'
import _verificationErrors from './_verification.error'

export const errorMessages: ErrorMessageCollection = {
  ..._authErrors,
  ..._fileErrors,
  ..._commonError,
  ..._userErrors,
  ..._permissionErrors,
  ..._verificationErrors,
}
