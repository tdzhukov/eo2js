import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { ElegantNumber } from '../target/generated-sources/atoms.js';
import { EOobj } from '../target/generated-sources/args_varargs.js';


describe('args_varargs.js', function () {
  it('should write to stdout "42 31 3"', function () {
    new EOobj().call(new ElegantNumber(42)).call(new ElegantNumber(31)).call(new ElegantNumber(0)).call(new ElegantNumber(1)).call(new ElegantNumber(2)).call(new ElegantNumber(3)).call(new ElegantNumber(4)).dataize();
    assert.equal(hook.captured(), '42 31 3');
  });
});
