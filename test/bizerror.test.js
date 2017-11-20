'use strict';

const request = require('supertest');

describe('test/bizerror.test.js', () => {
  describe('response error and not ouput bizParams', () => {
    createApp('apps/bizerror-test');

    it('should handle biz error with throwBizError', () => {
      return request(app.callback())
        .get('/throwError')
        .set('Accept', 'application/json')
        .expect(200)
        .expect({ code: 'USER_NOT_EXIST', message: 'user not exsit' });
    });

    it('should handle biz error with throwBizError and jsonp', () => {
      return request(app.callback())
        .get('/jsonp/throwError?_callback=fn')
        .set('Accept', 'application/js')
        .expect(200)
        .expect('/**/ typeof fn === \'function\' && fn({"code":"USER_NOT_EXIST","message":"user not exsit"});');
    });

    it('should return 404 with config is function', () => {
      return request(app.callback())
        .get('/notFoundData')
        .set('Accept', 'application/json')
        .expect(404)
        .expect({ code: 'NOT_FOUND_DATA', message: 'not found' });
    });

    it('should redirect 404 page', () => {
      return request(app.callback())
        .get('/notFoundPage')
        .expect(302)
        .expect(/404/);
    });

    it('should redirect error page', () => {
      return request(app.callback())
        .get('/redirectErrorPage')
        .expect(302)
        .expect(/404/);
    });

    it('should handle biz error with responseNoBizError', () => {
      return request(app.callback())
        .get('/responseBizError')
        .set('Accept', 'application/json')
        .expect(500)
        .expect({ code: 'SYSTEM_EXCEPTION', message: 'System Exception' });
    });

    it('should not handle biz error', () => {
      return request(app.callback())
        .get('/responseNoBizError')
        .set('Accept', 'application/json')
        .expect(500)
        .expect({ message: 'Internal Server Error' });
    });
  });

  describe('response error and ouput bizParams', () => {
    createApp('apps/bizerror-output-bizparams');

    it('should handle biz error with throwBizError', () => {
      return request(app.callback())
        .get('/throwError')
        .set('Accept', 'application/json')
        .expect(200)
        .expect({ code: 'USER_NOT_EXIST', message: 'user not exsit', errors: { id: 1, step: 2 } });
    });

    it('should handle biz error with responseBizError', () => {
      return request(app.callback())
        .get('/responseBizError')
        .set('Accept', 'application/json')
        .expect(500)
        .expect({ code: 'SYSTEM_EXCEPTION', message: 'System Exception', errors: { id: 1, step: 2 } });
    });

    it('should handle unexpectedError error', () => {
      return request(app.callback())
        .get('/unexpectedError')
        .set('Accept', 'application/json')
        .expect(500)
        .expect({ code: 'SYSTEM_EXCEPTION', message: 'System Exception' });
    });
  });

  describe('override bizerror handler', () => {
    createApp('apps/bizerror-override-handler');

    it('should handle biz error with throwBizError', () => {
      return request(app.callback())
        .get('/throwError')
        .set('Accept', 'application/json')
        .expect(200)
        .expect({ code: 'USER_NOT_EXIST', msg: 'user not exsit', override: true });
    });

    it('should handle biz error with responseBizError', () => {
      return request(app.callback())
        .get('/responseBizError')
        .set('Accept', 'application/json')
        .expect(500)
        .expect({ code: 'SYSTEM_EXCEPTION', msg: 'System Exception', override: true });
    });
  });
});
