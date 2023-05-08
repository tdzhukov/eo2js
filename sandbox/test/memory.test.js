import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { EOapp } from '../target/generated-sources/memory.js';

describe('memory.js', function () {
  it('should write to stdout "0\\nHello, world!\\n"', function () {
    new EOapp().dataize();
    assert.equal(hook.captured(), '0\nHello, world!\n');
  });
});
