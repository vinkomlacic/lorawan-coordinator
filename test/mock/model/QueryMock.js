'use strict';
class QueryMock {
  constructor(objects) {
    if (objects instanceof Array) {
      this.objects = [...objects];
    } else {
      throw new Error('Illegal argument exception');
    }
  }

  /**
   * Applies query params to collection
   * @param {Object} params
   * @return {QueryMock} this instance
   */
  where(params) {
    this.queriedObjects = this.objects.filter((object) => {
      let isTrue = true;
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          isTrue &= this.objects[key] === params[key];
        }
      }

      return isTrue;
    });

    return this;
  }

  /**
   * @return {T[] | *} queried objects
   */
  select() {
    return this.queriedObjects;
  }
}

module.exports = QueryMock;
