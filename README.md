# postcss-property-lookup

<img align="right" width="135" height="95"
	title="Philosopher’s stone, logo of PostCSS"
	src="http://postcss.github.io/postcss/logo-leftp.png">

[![NPM version](http://img.shields.io/npm/v/postcss-property-lookup.svg?style=flat)](https://www.npmjs.org/package/postcss-property-lookup)
[![npm license](http://img.shields.io/npm/l/postcss-property-lookup.svg?style=flat-square)](https://www.npmjs.org/package/postcss-property-lookup)
[![Travis Build Status](https://img.shields.io/travis/simonsmith/postcss-property-lookup.svg?label=unix)](https://travis-ci.org/simonsmith/postcss-property-lookup)
[![AppVeyor Build Status](https://img.shields.io/appveyor/ci/simonsmith/postcss-property-lookup.svg?label=windows)](https://ci.appveyor.com/project/simonsmith/postcss-property-lookup)

[![npm](https://nodei.co/npm/postcss-property-lookup.svg?downloads=true)](https://nodei.co/npm/postcss-property-lookup/)

[PostCSS](https://github.com/postcss/postcss) plugin that allows referencing property values without a variable, [similar to Stylus](https://learnboost.github.io/stylus/docs/variables.html#property-lookup).

```scss
.Test {
  margin-left: 20px;
  margin-right: @margin-left;
  color: red;
  background: @color url('test.png');
}
```

Transpiles into:

```scss
.Test {
  margin-left: 20px;
  margin-right: 20px;
  color: red;
  background: red url('test.png');
}
```

Check the [tests](https://github.com/simonsmith/postcss-property-lookup/blob/master/test/plugin.ts) for more examples.

## Installation

```
$ npm install postcss-property-lookup
```

## Usage

### JavaScript

```js
postcss([
	require('postcss-property-lookup')(/* options */),
	// more plugins...
])
```

### TypeScript

```ts
///<reference path="node_modules/postcss-property-lookup/.d.ts" />
import postcssPropertyLookup from 'postcss-property-lookup';

postcss([
	postcssPropertyLookup(/* options */),
	// more plugins...
])
```

## Options

### logLevel

Type: `string: <error|warn>`<br>
Required: `false`<br>
Default: `error`

When a lookup cannot be resolved, this specifies whether to throw an error or log a warning. In the case of a warning, the invalid lookup value will be replaced with an empty string.


## Testing

Run the following command:

```
$ npm test
```

This will build scripts, run tests and generate a code coverage report. Anything less than 100% coverage will throw an error.

### Watching

For much faster development cycles, run the following command:

```
$ npm run watch
```

This will build scripts, run tests and watch for changes.
