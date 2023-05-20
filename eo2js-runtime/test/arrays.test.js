import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { EOapp } from '../target/generated-sources/arrays.js';


describe('arrays.js', function () {
  it('should write to stdout "string true another array 1 2 3 4 5"', function () {
    new EOapp().dataize();
    assert.equal(hook.captured(), 'string true another array 1 2 3 4 5');
  });
});
