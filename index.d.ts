declare module 'egg' {
  export interface Context {
    throwBizError(code: string | number, error?: Error | string, addition?: { [prop: string]: any}): never;
    throwBizError(code: string | number, addition: { [prop: string]: any}): never;
    throwBizError(error: Error, addition?: { [prop: string]: any}): never;
    throwBizError(addition: { [prop: string]: any}): never;

    responseBizError(error: Error, addition?: { [prop: string]: any}): void;
  }
}