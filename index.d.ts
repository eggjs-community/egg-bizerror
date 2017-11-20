// 表明依赖egg，否则会覆盖egg的声明
import 'egg';

declare module 'egg' {

  interface bizConfig {
    code?: string | number; 
    bizError?: boolean;
    log?: boolean;
    sendClient?: any;
    [prop: string]: any;
  }

  interface Context {
    throwBizError(code: string | number, error?: Error | string, bizParams?: bizConfig): never;
    throwBizError(code: string | number, bizParams: bizConfig): never;
    throwBizError(error: Error, bizParams?: bizConfig): never;
    throwBizError(bizParams: bizConfig): never;

    responseBizError(error: Error, bizParams?: bizConfig): void;
  }
}