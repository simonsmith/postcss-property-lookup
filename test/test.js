import postcss from 'postcss';
import { expect } from 'chai';
import plugin from '../';
import fs from 'fs';
import path from 'path';

function readFixture(filename) {
  return fs.readFileSync(path.join('test/fixtures', filename), 'utf-8');
}

function test(input, output, opts, done) {
  input = readFixture(`in/${input}`);
  output = readFixture(`out/${output}`);

  postcss([ plugin(opts) ]).process(input).then((result) => {
    expect(result.css).to.eql(output);
    expect(result.warnings()).to.be.empty;
    done();
  }).catch(done);
}

describe('postcss-property-lookup', function () {
  it('should allow property lookup', function(done) {
    test('default.css', 'default.css', {}, done);
  });

  it('should work with nested rules', function(done) {
    test('nested.css', 'nested.css', {}, done);
  });

  it('should ignore values when a lookup fails, and output a warning', function(done) {
    var input = readFixture('in/invalid.css');
    var output = readFixture('out/invalid.css');

    postcss([ plugin({}) ]).process(input).then(function(result) {
      expect(result.css).to.eql(output);
      expect(result.warnings().length).to.equal(4);
      done();
    }).catch(done);
  });
});
