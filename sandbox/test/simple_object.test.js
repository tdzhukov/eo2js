import assert from 'node:assert/strict';
import { ElegantString } from '../target/generated-sources/atoms.js';
import { EOperson } from '../target/generated-sources/simple_object.js';


describe('simple_object.js', function () {
  it('should return throw exception', function () {
    assert.throws(() => new EOperson().call(new ElegantString("Nikita")).dataize());
  });
});
