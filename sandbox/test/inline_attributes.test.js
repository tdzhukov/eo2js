import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { EOh } from '../target/generated-sources/inline_attributes.js';


describe('inline_attributes.js', function () {
  it('should write to stdout "hello %s %s"', function () {
    new EOh().dataize();
    assert.equal(hook.captured(), 'hello %s %s');
  });
});
