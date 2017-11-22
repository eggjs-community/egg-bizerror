'use strict';

module.exports = () => {
  return async function bizErrorMiddleware(ctx, next) {
    try {
      await next();
    } catch (error) {
      ctx.responseBizError(error);
    }
  };
};
