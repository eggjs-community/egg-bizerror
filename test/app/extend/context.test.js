'use strict';

const assert = require('assert');

describe('test/app/extend/throwerror.test.js', () => {
  describe('throw error', () => {
    createApp('apps/bizerror-test');

    it('should throw error with code', () => {
      const ctx = app.mockContext();

      assert.throws(
        () => ctx.throwBizError('USER_NOT_EXIST'),
        error => {
          assert.equal(error.code, 'USER_NOT_EXIST');
          assert.equal(error.bizError, true);
          return true;
        }
      );
    });

    it('should throw error with error object', () => {
      const ctx = app.mockContext();

      assert.throws(
        () => ctx.throwBizError(new Error('this is an error')),
        error => {
          assert.equal(error.code, 'SYSTEM_EXCEPTION');
          assert.equal(error.message, 'this is an error');
          assert.equal(error.bizError, true);
          return true;
        }
      );
    });

    it('should throw error with bizParams', () => {
      const ctx = app.mockContext();

      assert.throws(
        () => ctx.throwBizError({ code: 'USER_NOT_EXIST', message: 'this is an error', id: 1 }),
        error => {
          assert.equal(error.code, 'USER_NOT_EXIST');
          assert.equal(error.bizError, true);
          assert.equal(error.bizParams.id, 1);
          assert.equal(error.bizParams.message, 'this is an error');
          return true;
        }
      );
    });

    it('should throw error with code and error object', () => {
      const ctx = app.mockContext();

      assert.throws(
        () => ctx.throwBizError('USER_NOT_EXIST', new Error('this is an error')),
        error => {
          assert.equal(error.code, 'USER_NOT_EXIST');
          assert.equal(error.bizError, true);
          assert.equal(error.message, 'this is an error');
          return true;
        }
      );
    });

    it('should throw error with code and error message', () => {
      const ctx = app.mockContext();

      assert.throws(
        () => ctx.throwBizError('USER_NOT_EXIST', 'this is an error'),
        error => {
          assert.equal(error.code, 'USER_NOT_EXIST');
          assert.equal(error.bizError, true);
          assert.equal(error.message, 'this is an error');
          return true;
        }
      );
    });

    it('should throw error with code and bizParams', () => {
      const ctx = app.mockContext();

      assert.throws(
        () => ctx.throwBizError('USER_NOT_EXIST', { id: 1 }),
        error => {
          assert.equal(error.code, 'USER_NOT_EXIST');
          assert.equal(error.bizError, true);
          assert.equal(error.bizParams.id, 1);
          return true;
        }
      );
    });

    it('should throw error with error object and bizParams', () => {
      const ctx = app.mockContext();

      assert.throws(
        () => ctx.throwBizError(new Error('this is an error'), { id: 1 }),
        error => {
          assert.equal(error.code, 'SYSTEM_EXCEPTION');
          assert.equal(error.bizError, true);
          assert.equal(error.message, 'this is an error');
          assert.equal(error.bizParams.id, 1);
          return true;
        }
      );
    });

    it('should throw error with code and error message and bizParams', () => {
      const ctx = app.mockContext();

      assert.throws(
        () => ctx.throwBizError('USER_NOT_EXIST', 'this is an error', { id: 1 }),
        error => {
          assert.equal(error.code, 'USER_NOT_EXIST');
          assert.equal(error.bizError, true);
          assert.equal(error.message, 'this is an error');
          assert.equal(error.bizParams.id, 1);
          return true;
        }
      );
    });

    it('should throw error with code and error message and bizParams', () => {
      const ctx = app.mockContext();

      assert.throws(
        () => ctx.throwBizError('USER_NOT_EXIST', new Error('this is an error'), { id: 1 }),
        error => {
          assert.equal(error.code, 'USER_NOT_EXIST');
          assert.equal(error.bizError, true);
          assert.equal(error.message, 'this is an error');
          assert.equal(error.bizParams.id, 1);
          return true;
        }
      );
    });
  });

  describe('response error', () => {
    createApp('apps/bizerror-test');

    it('should throw an error', () => {
      const ctx = app.mockContext();

      assert.throws(() => ctx.responseBizError(new Error()));
    });

    it('should handler an error', () => {
      const ctx = app.mockContext();

      app.on('responseBizError', (ctx, error) => {
        assert.equal(error.code, 'USER_NOT_EXIST');
        assert.equal(error.message, 'this is an error');
        assert.equal(error.bizError, true);
        assert.equal(error.bizParams.id, 1);
      });

      ctx.responseBizError(new Error('this is an error'), { bizError: true, code: 'USER_NOT_EXIST', id: 1 });
    });
  });
});
