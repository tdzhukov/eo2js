import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { EOapp } from '../target/generated-sources/app.js';

describe('app.js', function () {
  it('should write to stdout "true\\n"', function () {
    new EOapp().dataize();
    assert.equal(hook.captured(), 'true\n');
  });
});
