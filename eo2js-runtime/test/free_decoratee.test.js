import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { EOapp } from '../target/generated-sources/free_decoratee.js';


describe('free_decoratee.js', function () {
  it('should write to stdout "5 6\\n"', function () {
    new EOapp().dataize();
    assert.equal(hook.captured(), '5 6\n');
  });
});
