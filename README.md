# postcss-property-lookup [![Build Status][ci-img]][ci]

[PostCSS] plugin that allows referencing property values without a variable, [similar to Stylus](https://learnboost.github.io/stylus/docs/variables.html#property-lookup).

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/simonsmith/postcss-property-lookup.svg
[ci]:      https://travis-ci.org/simonsmith/postcss-property-lookup


```css
.Test {
  margin-left: 20px;
  margin-right: @margin-left;
  color: red;
  background: @color url('test.png');
}
```

```css
.Test {
  margin-left: 20px;
  margin-right: 20px;
  color: red;
  background: red url('test.png');
}
```

Check the [test fixtures](test/fixtures/in) for more examples.

## Usage

```js
postcss([ require('postcss-property-lookup') ])
```

See [PostCSS] docs for examples for your environment.

## Options

### logLevel

Type: `string: <error|warn>`<br>
Required: `false`<br>
Default: `warn`

When a lookup cannot be resolved, this specifies whether to throw an error or log a warning. In the case of a warning, the invalid lookup value will be replaced with an empty string.
