'use strict';

const mm = require('egg-mock');
const is = require('is-type-of');
const sleep = require('ko-sleep');

global.mm = global.mock = mm;

/**
 * 此种方式，在egg-bin(引用power-assert问题)下运行，会出现断言失效的问题。
 * 如需用到断言库，在各个文件单独引用个
 */
// global.assert = require('assert');

let app;

global.createApp = function(name, options) {
  create('app', name, options);
};

global.createCluster = function(name, options) {
  create('cluster', name, options);
};

function create(target, name, options){
  options = formatOptions(name, options);
  
  before(function *() {
    mm.env(options.env);
    mm.consoleLevel('NONE');
    app = global.app = mm[target](options);
    yield app.ready();
    if(is.number(options.sleep)){
      yield sleep(options.sleep);
    }
  });

  after(() => app.close());

  afterEach(mm.restore);
}

function formatOptions(name, options) {
  if (is.object(name)) {
    [name, options] = [null, name];
  }

  return Object.assign(
    name ? { baseDir: name } : {}, 
    {
      coverage: false,
      cache: false,
      work: 1,
      env: 'prod',
    }, 
    options
  );
}