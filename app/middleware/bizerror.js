'use strict';

module.exports = () => {
  return function* (next) {
    try {
      yield next;
    } catch (error) {
      this.responseBizError(error);
    }
  };
};
