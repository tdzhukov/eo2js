import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { EOmainApp } from '../target/generated-sources/dataize_once_hello.js';


describe('dataize_once_hello.js', function () {
  it('should write to stdout "Hello, Nikita!\\n"', function () {
    new EOmainApp().dataize();
    assert.equal(hook.captured(), 'Hello, Nikita!\n');
  });
});
