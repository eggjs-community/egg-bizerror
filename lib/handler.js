'use strict';

const is = require('is-type-of');

module.exports = class BizErrorHanlder {
  constructor(app) {
    this.app = app;
    this.config = app.config.bizerror;
    this.keyword = [ 'status', 'errorPageUrl' ];
  }

  /**
   * get response info
   * @param {Context} ctx context
   * @param {Error} error error
   * @return {Array} [responseInfo, keywordValue]
   */
  getResponseInfo(ctx, error) {
    const { config: { errorcode } } = this;

    let codeConfig = errorcode[error.code];

    if (is.function(codeConfig)) {
      codeConfig = codeConfig(ctx, error);

      if (codeConfig === false) {
        return [ null, false ];
      }
    }

    if (!codeConfig) {
      ctx.coreLogger.warn('[BizError] not found error code config', error);
      codeConfig = {
        status: 500,
        code: 'SYSTEM_EXCEPTION',
        message: 'System Exception',
      };
    }

    if (is.function(codeConfig.errorPageUrl)) {
      codeConfig.errorPageUrl = codeConfig.errorPageUrl(ctx, error);
    }

    const option = {};
    let responseInfo = {};

    Object.keys(codeConfig).forEach(key => {
      if (this.keyword.includes(key)) {
        option[key] = codeConfig[key];
      } else {
        responseInfo[key] = codeConfig[key];
      }
    });

    responseInfo = Object.assign(
      {
        code: error.code,
        message: error.message,
      },
      responseInfo
    );

    return [ option, responseInfo ];
  }

  /**
   * handle error
   * @param {Context} ctx context
   * @param {Error} error error
   */
  responseError(ctx, error) {
    const { config } = this;
    const [ option, responseInfo ] = this.getResponseInfo(ctx, error);

    // you can return false, break default process and customize
    // close default handler
    if (responseInfo === false || config.disableDefaultHandler === true) {
      return;
    }

    if (config.outputErrorAddition === true) {
      responseInfo.errorAddition = error.addition;
    }

    if (error.log !== false) {
      ctx.logger.error(error);
    }

    // set http status
    ctx.status = option.status || 500;

    const fn = this.accepts(ctx);

    this[fn](ctx, error, responseInfo, option);
  }

  accepts(ctx) {
    if (ctx.acceptJSON) {
      return 'json';
    }

    if (ctx.acceptJSONP) {
      return 'jsonp';
    }

    return 'html';
  }

  html(ctx, error, responseInfo, option) {
    // if set errorPageUrl, redirect this url
    if (option.errorPageUrl) {
      return ctx.redirect(option.errorPageUrl);
    }

    const propertyMsg = Object.keys(responseInfo).map(key => {
      if (key === 'message') return '';
      return `${key}: ${responseInfo[key]}`;
    }).join('\n');

    ctx.body = `
      <h2>${responseInfo.message}</h2>
      <pre>
        ${propertyMsg}
      <pre>
      `;
  }

  json(ctx, error, responseInfo) {
    ctx.body = responseInfo;
  }

  // feature: need egg-jsonp fit
  // jsonp(ctx, error, responseInfo) {

  // }
};
