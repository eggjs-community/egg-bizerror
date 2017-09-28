'use strict';

/**
 * egg-bizerror default config
 * @member Config#bizerror
 */
exports.bizerror = {
  disableDefaultHandler: false, // disable default error handler
  outputErrorAddition: false, // return error addition to user
  responseAllException: false, // handle all exception, not only bizError exception
};
