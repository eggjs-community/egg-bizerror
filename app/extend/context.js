'use strict';

const is = require('is-type-of');
const DEFAULT_CODE = 'SYSTEM_EXCEPTION';

module.exports = {
  /**
   * throw a biz error
   * @param {String} code  error code, default system_exception
   * @param {Error|String} error error or mesaage, default 'SYSTEM EXCEPTION'
   * @param {Object} bizParams additive attribute
   * @public
   *
   * @example
   *  ctx.throwBizError('system_exception')
   *  ctx.throwBizError(new Error())
   *  ctx.throwBizError({ id: 1, log: false })
   *  ctx.throwBizError('system_exception', { id: 1, log: false })
   *  ctx.throwBizError('system_exception', 'error message')
   *  ctx.throwBizError('system_exception', new Error())
   *  ctx.throwBizError(new Error(), { id: 1, log: false })
   *  ctx.throwBizError('system_exception', 'error message', { id: 1, log: false })
   *
   */
  throwBizError(code, error, bizParams) {
    const args = [ DEFAULT_CODE, '', null ];
    if (is.error(code)) {
      args[1] = code;
      if (is.object(error)) {
        args[2] = error;
      }
    } else if (is.object(code)) {
      args[2] = code;
    } else {
      args[0] = code;
      if (is.object(error) && !is.error(error)) {
        args[2] = error;
      } else {
        if (is.error(error) || is.string(error)) {
          args[1] = error;
        }
        if (is.object(bizParams)) {
          args[2] = bizParams;
        }
      }
    }

    ([ code, error, bizParams ] = args);

    if (!is.error(error)) {
      error = new Error(error);
      Error.captureStackTrace(error, module.exports.throwBizError);
    }

    // bizerror not repeat processing
    if (error.bizError !== true) {
      extendErrorProperty(error, { code, bizError: true }, bizParams);
    }

    throw error;
  },

  /**
   * handle error
   * @param {Error} error error
   * @param {Object} bizParams additive attribute
   */
  responseBizError(error, bizParams) {
    /* istanbul ignore if */
    if (!is.error(error)) {
      return;
    }

    // not biz error, throw
    if (error.bizError !== true && (bizParams || {}).bizError !== true && this.app.config.bizerror.interceptAllError !== true) {
      throw error;
    }

    extendErrorProperty(error, bizParams);

    this.app.emit('responseBizError', this, error);
  },
};

function extendErrorProperty(error, ...properties) {
  // set code
  error.code = error.code || DEFAULT_CODE;

  /* istanbul ignore if */
  if (properties.length === 0) return;

  error.bizParams = error.bizParams || {};

  const bizParams = Object.assign({}, ...properties);

  Object.keys(bizParams).forEach(key => {
    const target = [ 'code', 'bizError', 'log' ].includes(key)
      ? error
      : error.bizParams;

    target[key] = bizParams[key];
  });
}
