import postcss from 'postcss';
import { expect } from 'chai';
import plugin from '../lib/';

describe('postcss-property-lookup', function () {

  it('resolves a simple lookup', () => {
    check(
      `a {
        foo: FOO;
        bar: @foo;
      }`,
      `a {
        foo: FOO;
        bar: FOO;
      }`
    );
  });

  it('resolves an out-of-order lookup', () => {
    check(
      `a {
        foo: @bar;
        bar: BAR;
      }`,
      `a {
        foo: BAR;
        bar: BAR;
      }`
    );
  });

  it('resolves 2 lookups in the same rule', () => {
    check(
      `a {
        foo: @bar;
        bar: BAR;
        baz: @bar;
      }`,
      `a {
        foo: BAR;
        bar: BAR;
        baz: BAR;
      }`
    );
  });

  it('resolves 2 lookups in the same value', () => {
    check(
      `a {
        foo: FOO;
        bar: BAR;
        baz: @foo @bar;
      }`,
      `a {
        foo: FOO;
        bar: BAR;
        baz: FOO BAR;
      }`
    );
  });

  it('resolves a lookup inside a rule within an at-rule', () => {
    check(
      `@a {
        b {
          foo: FOO;
          bar: @foo;
        }
      }`,
      `@a {
        b {
          foo: FOO;
          bar: FOO;
        }
      }`
    );
  });

  it('resolves a lookup sandwiched inside a value', () => {
    check(
      `a {
        foo: FOO;
        bar: BAR @foo BAZ;
      }`,
      `a {
        foo: FOO;
        bar: BAR FOO BAZ;
      }`
    );
  });

  it('resolves a lookup of a lookup', () => {
    check(
      `a {
        foo: FOO;
        bar: @foo;
        baz: @bar;
      }`,
      `a {
        foo: FOO;
        bar: FOO;
        baz: FOO;
      }`
    );
  });

  it('resolves an out-of-order lookup of a lookup', () => {
    check(
      `a {
        foo: FOO;
        bar: @baz;
        baz: @foo;
      }`,
      `a {
        foo: FOO;
        bar: FOO;
        baz: FOO;
      }`
    );
  });

  it('resolves a nested lookup', () => {
    check(
      `a {
        foo: FOO;
        foo: BAR;
        b {
          baz: @foo;
        }
      }`,
      `a {
        foo: FOO;
        foo: BAR;
        b {
          baz: BAR;
        }
      }`
    );
  });

  it('resolves a nested lookup, bubbling up the stack until found', () => {
    check(
      `a {
        foo: FOO;
        b {
          foo: BAR;
          foo: BAZ;
          c {
            qux: @foo;
          }
        }
      }`,
      `a {
        foo: FOO;
        b {
          foo: BAR;
          foo: BAZ;
          c {
            qux: BAZ;
          }
        }
      }`
    );
  });

  it('resolves a nested lookup without going down the stack', () => {
    check(
      `a {
        foo: FOO;
        bar: @foo;
        b {
          foo: BAZ;
          bar: @foo;
        }
      }`,
      `a {
        foo: FOO;
        bar: FOO;
        b {
          foo: BAZ;
          bar: BAZ;
        }
      }`
    );
  });

  describe('plugin options', () => {

    describe('logLevel', () => {

      describe('warn (default)', () => {
        it('replaces a lookup that cannot be resolved with an empty string', () => {
          check(
            `a {
              foo: @bar;
            }`,
            `a {
              foo: ;
            }`
          );
        });
      });

      describe('error', () => {
        it('throws when a lookup cannot be resolved', () => {
          check(
            `a {
              foo: @bar;
            }`,
            /Unable to find property @bar in a/,
            { logLevel: 'error' }
          );
        });
      });

      describe('foo', () => {
        it('throws "Invalid logLevel: foo"', () => {
          function fn() {
            plugin({ logLevel: 'foo' });
          }
          expect(fn).to.throw('Invalid logLevel: foo');
        });
      });

    });

  });

  function check(actual, expected, options) {
    const processor = postcss().use(plugin(options));
    if (expected instanceof RegExp) {
      expect(() => {
        return processor.process(stripTabs(actual)).css;
      }).to.throw(expected);
      return;
    }
    expect(
      processor.process(stripTabs(actual)).css
    ).to.equal(
      stripTabs(expected)
    );
  }

  function stripTabs(input) {
    return input.replace(/\t/g, '');
  }

});
