import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { EOapp } from '../target/generated-sources/cage.js';

describe('cage.js', function () {
  it('should write to stdout "0\\nHello, world!\\n"', function () {
    new EOapp().dataize();
    assert.equal(hook.captured(), 'func\n');
  });
});
