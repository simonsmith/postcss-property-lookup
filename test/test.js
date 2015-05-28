var postcss = require('postcss');
var expect  = require('chai').expect;
var plugin  = require('../');
var fs      = require('fs');
var path    = require('path');

function readFixture(filename) {
  return fs.readFileSync(path.join('test/fixtures', filename), 'utf-8');
}

var test = function(input, output, opts, done) {
  input = readFixture(input);
  output = readFixture(output);

  postcss([ plugin(opts) ]).process(input).then(function(result) {
    expect(result.css).to.eql(output);
    expect(result.warnings()).to.be.empty;
    done();
  }).catch(done);
};

describe('postcss-property-lookup', function () {
  it('should allow property lookup', function(done) {
    test('in/default.css', 'out/default.css', {}, done);
  });

  it('should work with nested rules', function(done) {
    test('in/nested.css', 'out/nested.css', {}, done);
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
