import { Vector2 } from '../src/main';

const assert = require('assert');

describe('Vector2', function () {
  describe('#add()', function () {
    it('should add composants of each vector', function () {
      const vector1 = new Vector2(1, 2);
      const vector2 = new Vector2(3, 4);
      vector1.add(vector2);
      assert.equal(vector1.x, 4);
      assert.equal(vector1.y, 6);
    });
    it('should add negative composants of each vector', function () {
      const vector1 = new Vector2(-1, 2);
      const vector2 = new Vector2(3, -4);
      vector1.add(vector2);
      assert.equal(vector1.x, 2);
      assert.equal(vector1.y, -2);
    });
  });
  describe('#substract()', function () {
    it('should substract composants of each vector', function () {
      const vector1 = new Vector2(3, 4);
      const vector2 = new Vector2(1, 2);
      vector1.substract(vector2);
      assert.equal(vector1.x, 2);
      assert.equal(vector1.y, 2);
    });
    it('should substract negative composants of each vector', function () {
      const vector1 = new Vector2(-1, 2);
      const vector2 = new Vector2(3, -4);
      vector1.substract(vector2);
      assert.equal(vector1.x, -4);
      assert.equal(vector1.y, 6);
    });
  });
});
