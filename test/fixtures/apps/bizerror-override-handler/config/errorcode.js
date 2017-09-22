'use strict';

module.exports = {
  USER_NOT_EXIST: {
    status: 200,
    message: 'user not exsit',
  },
  PARAMS_ERROR: {
    status: 400,
    message: 'params is wrong',
    errorPageUrl: () => '/public/404.html',
  },
  NOT_FOUND_DATA: () => ({
    status: 404,
    message: 'not found',
  }),
  NOT_FOUND_PAGE: ctx => {
    ctx.redirect('/public/404.html');
    return false;
  },
};
