# egg-bizerror

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-bizerror.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-bizerror
[travis-image]: https://img.shields.io/travis/beliefgp/egg-bizerror.svg?style=flat-square
[travis-url]: https://travis-ci.org/beliefgp/egg-bizerror
[codecov-image]: https://img.shields.io/codecov/c/github/beliefgp/egg-bizerror.svg?style=flat-square
[codecov-url]: https://codecov.io/github/beliefgp/egg-bizerror?branch=master
[david-image]: https://img.shields.io/david/beliefgp/egg-bizerror.svg?style=flat-square
[david-url]: https://david-dm.org/beliefgp/egg-bizerror
[snyk-image]: https://snyk.io/test/npm/egg-bizerror/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-bizerror
[download-image]: https://img.shields.io/npm/dm/egg-bizerror.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-bizerror

egg 业务异常处理插件.

## 安装

```bash
$ npm i egg-bizerror --save
```

## 使用

```js
// config/plugin.js
exports.bizerror = {
  enable: true,
  package: 'egg-bizerror',
};
```

## 配置

```js
// config/config.default.js
exports.bizerror = {
  breakDefault: false, // 全局关闭默认处理逻辑
  sendClientAllParams: false, // 输出所有的 bizParams 至浏览器，将挂载在 json 对象的 errors 属性上。
  interceptAllError: false, // 拦截所有的异常，默认是只拦截有 error.bizError=true 标记的异常
};

// config/errorcode.js
module.exports = {
  'USER_NOT_EXIST': {
    status: 400,
    code: '400' // 重写返回的 code 值
    message: 'can`t find user info',
    errorPageUrl: '', // 当请求头 Accept 是 html 时，将302跳转至该链接 
    addtion1: 'a', // 多余配置信息，将附加在结果中输出给浏览器
  },
  'NOT_FOUND': {
    errorPageUrl: (ctx, error) => {
      return '/404.html';
    }
  }
  '404': (ctx, error) => {
    ctx.redirect('/404.html');
    return false; // return false, 将阻断默认处理逻辑
  }
}
```

## API

* ctx.throwBizError(code, error, bizParams)

  throw an biz error

  * code - `error.code`, 默认 `SYSTEM_EXCEPTION`，将根据该值，在errorcode.js文件中寻找对应配置。
  * error - `Error` 对象或者`message`。
  * bizParams - `error.bizParams`, 扩展数据，存放方便帮你定位异常原因的数据，会记录在错误日志中。可以选择开启sendClientAllParams，全部返回给客户端请求。
  * bizParams.sendClient - 发送给客户端的数据，将挂载到json对象的`errors`属性上。
  * bizParams.code - 覆盖`error.code`.
  * bizParams.log - `error.log`, 是否记录该错误至日志.

```js
// throw an error object
// error.code
// error.message
// error.log
// error.bizParams
// error.bizError
ctx.throwBizError('system_exception')
ctx.throwBizError(new Error())
ctx.throwBizError({ code: 'system_exception', log: false })
ctx.throwBizError('system_exception', { userId: 1, log: false })
ctx.throwBizError('system_exception', 'error message')
ctx.throwBizError('system_exception', new Error())
ctx.throwBizError(new Error(), { userId: 1, log: false })
ctx.throwBizError('system_exception', 'error message', { userId: 1, log: false })
```

* ctx.responseBizError(error, bizParams)

  处理异常方法

  * bizParams - 配置同上。
  * bizParams.bizError - 当需要处理非`ctx.throwBizError`抛出的异常时，需要手动标记`bizError: true`.

* app.on('responseBizError', (ctx, error) => {})

  你可以监听该事件，做一些其他事情，比如：统计错误等等。

* app.BizErrorHandler  

  默认的异常处理类，你可以重写该类。

## 范例

```js
// app/service/user.js
module.exports = app => {
  class User extends app.Service {
    async getUserId() {
      let userInfo;
      try {
        userInfo = await this.getUser();
      } catch (error) {
        ctx.responseBizError(error, { bizError: true, code: 'USER_NOT_EXIST' })
        return;
      }
      
      if (!userInfo || !userInfo.id) {
        ctx.throwBizError('USER_NOT_EXIST');
      }
      return userInfo.id;
    }
  }
  return User;
};

// app.js
// 增加监听逻辑，做异常分类统计
module.exports = app => {
  app.on('responseBizError', (ctx, error) => {
    if (error.bizParams && error.bizParams.bizType === 'getUser') {
      errorCount++;
    }
  });
};

// app.js
// 如果有特殊需要，可以选择重写默认处理类
module.exports = app => {
  app.BizErrorHandler = class extends app.BizErrorHandler {
    json(ctx, error, config) {
      ctx.body = {
        code: config.code,
        msg: config.message,
      };
    }
  }
};

```

## License

[MIT](LICENSE)
