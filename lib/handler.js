'use strict';

const { isProd, getCodeConfig } = require('./utils');

module.exports = class BizErrorHanlder {
  constructor(app) {
    this.app = app;
    this.config = app.config.bizerror;
  }

  /**
   * handle error
   * @param {Context} ctx context
   * @param {Error} error error
   */
  responseError(ctx, error) {
    const { config } = this;
    const codeConfig = getCodeConfig(error, config, ctx);

    // you can return false, break default process and customize
    // close default handler
    if (codeConfig.breakDefault === true || config.breakDefault === true) return;

    if (error.log !== false) {
      ctx.logger.error(error);
    }

    if (!isProd(this.app) || config.outputErrorAddition === true) {
      codeConfig.addition = error.addition;
    }

    // set http status
    ctx.status = codeConfig.status || 500;

    const fn = this.accepts(ctx);

    this[fn](ctx, error, codeConfig);
  }

  getOutputInfo(codeConfig) {
    return Object.keys(codeConfig).reduce((obj, key) => {
      if (![ 'status', 'breakDefault', 'errorPageUrl' ].includes(key)) {
        obj[key] = codeConfig[key];
      }
      return obj;
    }, {});
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

  html(ctx, error, config) {
    // if set errorPageUrl, redirect this url
    if (config.errorPageUrl) {
      return ctx.redirect(config.errorPageUrl);
    }

    const info = this.getOutputInfo(config);
    const propertyMsg = Object.keys(info).map(key => {
      if (key === 'message') return '';
      return `${key}: ${info[key]}`;
    }).join('\n');

    ctx.body = `
      <h2>${info.message}</h2>
      <pre>
        ${propertyMsg}
      <pre>
      `;
  }

  json(ctx, error, config) {
    ctx.body = this.getOutputInfo(config);
  }

  jsonp(ctx, error, config) {
    ctx.createJsonpBody
      ? ctx.createJsonpBody(this.getOutputInfo(config))
      : this.json(ctx, error, config);
  }
};
