'use strict';

/**
 * egg-bizerror default config
 * @member Config#bizerror
 */
exports.bizerror = {
  breakDefault: false, // disable default error handler
  outputErrorAddition: false, // return error addition to user
  interceptAllError: false, // handle all error, not only bizError error
};
