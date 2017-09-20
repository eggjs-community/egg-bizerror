'use strict';

module.exports = app => {
  app.get('/throwError', app.controller.bizerror.throwError);
  app.get('/responseBizError', app.controller.bizerror.responseBizError);
  app.get('/responseNoBizError', app.controller.bizerror.responseNoBizError);
  app.get('/notFoundData', app.controller.bizerror.notFoundData);
  app.get('/notFoundPage', app.controller.bizerror.notFoundPage);
  app.get('/redirectErrorPage', app.controller.bizerror.redirectErrorPage);
};
