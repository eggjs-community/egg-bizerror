'use strict';

module.exports = app => {
  app.get('/throwError', app.controller.bizerror.throwError);
  app.get('/responseBizError', app.controller.bizerror.responseBizError);
  app.get('/unexpectedError', app.controller.bizerror.unexpectedError);
};
