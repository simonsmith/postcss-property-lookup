var postcss = require('postcss');

module.exports = postcss.plugin('postcss-property-lookup', propertyLookup);

function propertyLookup() {
  return function(css) {
    css.eachRule(function(rule) {
      rule.replaceValues(/@([a-z-]+)/g, { fast: '@' }, function(orig, prop) {
        var replacement;
        rule.eachDecl(prop, function(decl) {
          replacement = decl.value;
        });
        return replacement === undefined ? orig : replacement;
      });
    });
  };
}
