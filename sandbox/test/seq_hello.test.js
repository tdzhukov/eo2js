import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { EOapp } from '../target/generated-sources/seq_hello.js';


describe('seq_hello.js', function () {
  it('should write to stdout "Hello\\nWorld!\\nHow are you?"', function () {
    new EOapp().dataize();
    assert.equal(hook.captured(), 'Hello\nWorld!\nHow are you?');
  });
});
