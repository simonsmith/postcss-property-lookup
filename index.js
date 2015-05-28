var postcss = require('postcss');

module.exports = postcss.plugin('postcss-property-lookup', propertyLookup);

function propertyLookup() {
  return function(css, result) {
    css.eachRule(function(rule) {
      rule.replaceValues(/@([a-z-]+)(\s?)/g, { fast: '@' }, function(orig, prop, space) {
        var replacementVal;
        rule.eachDecl(prop, function(decl) {
          replacementVal = decl.value;
        });

        if (replacementVal) {
          return replacementVal + space;
        } else {
          result.warn('Unable to find property ' + orig + ' in ' + rule.selector, { node: rule });
          return '';
        }
      });
    });
  };
}
