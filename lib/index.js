import postcss from 'postcss';

export default postcss.plugin('postcss-property-lookup', propertyLookup);

function propertyLookup() {
  return function(root, result) {
    root.eachRule((rule) => {
      rule.replaceValues(/@([a-z-]+)(\s?)/g, { fast: '@' }, (orig, prop, space) => {
        let replacementVal;
        rule.eachDecl(prop, decl => replacementVal = decl.value);

        if (replacementVal) {
          return replacementVal + space;
        } else {
          result.warn(`Unable to find property ${orig} in ${rule.selector}`, { node: rule });
          return '';
        }
      });
    });
  };
}
