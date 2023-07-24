import _commonError from './_common.error';
import _userErrors from './_user.error';
import _authErrors from './_auth.error';
import _permissionErrors from './_permission.error';

export const errorMessages: ErrorMessageCollection = {
  ..._commonError,
  ..._userErrors,
  ..._authErrors,
  ..._permissionErrors,
};
