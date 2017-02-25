'use strict';

const Random = (() => {
  class Dist extends Array {
    next() {
      const n = Math.random();
      let sum = 0;
      for (let [item, weight] of this) {
        sum += weight;
        if (n <= sum) {
          return item;
        }
      }
    }
  };

  // FIXME inherited Array constructor has some unexpected 'features'. Override it.
  class DistBuilder extends Array {
    dist() {
      let sum = 0;
      for (let [_, weight] of this) {
        sum += weight;
      }
      const d = new Dist;
      for (let [item, weight] of this) {
        d.push([item, weight / sum]);
      }
      return d;
    }
  };

  class Sample extends Set {
    next() {
      const n = Math.floor(Math.random()*this.size);
      let i = 0;
      for (const item of this) {
        if (i == n) {
          this.delete(item);
          return item;
        }
        i++;
      }
    }
  }

  return {
    DistBuilder,
    Dist,
    Sample
  };
})();
