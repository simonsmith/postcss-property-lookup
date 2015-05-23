var postcss = require('postcss');
var expect  = require('chai').expect;
var plugin  = require('../');
var fs      = require('fs');
var path    = require('path');

var test = function(input, output, opts, done) {
  input = fs.readFileSync(path.join('test/fixtures', input), 'utf-8');
  output = fs.readFileSync(path.join('test/fixtures', output), 'utf-8');

  postcss([ plugin(opts) ]).process(input).then(function(result) {
    expect(result.css).to.eql(output);
    expect(result.warnings()).to.be.empty;
    done();
  }).catch(function (error) {
    done(error);
  });
};

describe('postcss-property-lookup', function () {
  it('should allow property lookup', function(done) {
    test('in/default.css', 'out/default.css', {}, done);
  });

  it('should work with nested rules', function(done) {
    test('in/nested.css', 'out/nested.css', {}, done);
  });
});
