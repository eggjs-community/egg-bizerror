'use strict';

/**
 * egg-bizerror default config
 * @member Config#bizerror
 */
exports.bizerror = {
  breakDefault: false, // disable default error handler
  sendClientAllParams: false, // return error bizParams to user
  interceptAllError: false, // handle all error, not only bizError error
};
