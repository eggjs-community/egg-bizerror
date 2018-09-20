import { Application, Context, PlainObject } from 'egg';

namespace EggBizError {
  interface bizConfig {
    code?: string | number; 
    bizError?: boolean;
    log?: boolean;
    sendClient?: PlainObject;
    [prop: string]: any;
  }

  interface CustomError extends Error {
    code: string;
    bizError: true;
    bizParams: PlainObject;
    log: boolean;
  }

  interface Config {
    code: string | number,
    message: string,
    status: number;
    breakDefault: boolean;
    errorPageUrl?: string | ((ctx: Context, error: CustomError) => any);
    errors?: PlainObject;
  }

  class BizErrorHandler {
    app: Application;
    config: Config;
    responseError(ctx: Context, error: CustomError): void;
    getOutputInfo(config: Config): any;
    accepts(ctx: Context): string;
    html(ctx: Context, error: CustomError, config: Config): void;
    json(ctx: Context, error: CustomError, config: Config): void;
    jsonp(ctx: Context, error: CustomError, config: Config): void;
  }
}

declare module 'egg' {
  interface Application {
    BizErrorHandler: typeof EggBizError.BizErrorHandler;
  }

  interface Context {
    throwBizError(code: string | number, error?: Error | string, bizParams?: EggBizError.bizConfig): never;
    throwBizError(code: string | number, bizParams: EggBizError.bizConfig): never;
    throwBizError(error: Error, bizParams?: EggBizError.bizConfig): never;
    throwBizError(bizParams: EggBizError.bizConfig): never;

    responseBizError(error: Error, bizParams?: EggBizError.bizConfig): void;
  }
}