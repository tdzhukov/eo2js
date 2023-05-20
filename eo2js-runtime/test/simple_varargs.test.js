import assert from 'node:assert/strict';
import { hook } from './capture_stream.js'
import { ElegantNumber } from '../target/generated-sources/atoms.js';
import { EOappArray } from '../target/generated-sources/simple_varargs.js';


describe('simple_varargs.js', function () {
  it('should return throw exception', function () {
    new EOappArray().call(new ElegantNumber(0)).call(new ElegantNumber(1)).call(new ElegantNumber(2)).call(new ElegantNumber(3)).dataize();
    assert.equal(hook.captured(), '3');
  });
});
