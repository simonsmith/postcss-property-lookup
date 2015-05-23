# PostCSS Property Lookup [![Build Status][ci-img]][ci]

[PostCSS] plugin that allows referencing property values without a variable.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/simonsmith/postcss-property-lookup.svg
[ci]:      https://travis-ci.org/simonsmith/postcss-property-lookup

Property lookups [similar to Stylus](https://learnboost.github.io/stylus/docs/variables.html#property-lookup):

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

## Usage

```js
postcss([ require('postcss-property-lookup') ])
```

See [PostCSS] docs for examples for your environment.
