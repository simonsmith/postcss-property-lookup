import postcss from 'postcss';

export default postcss.plugin('postcss-property-lookup', propertyLookup);

function propertyLookup() {

  const lookupPattern = /@([a-z-]+)(\s?)/g;

  return (root, result) => {
    root.walkRules(rule => {
      eachDecl(rule, decl => {
        if (decl.value.indexOf('@') === -1) {
          return;
        }
        decl.value = decl.value.replace(
          lookupPattern,
          resolveLookup.bind(this, rule)
        );
      });
    });

    function resolveLookup(rule, orig, prop, space) {
      const resolvedValue = closest(rule, prop);
      if (!resolvedValue) {
        rule.warn(result, `Unable to find property ${orig} in ${rule.selector}`);
        return '';
      }
      return resolvedValue + space;
    }

    function closest(container, prop) {
      if (!container) {
        return '';
      }
      let resolvedValue;
      eachDecl(container, decl => {
        if (decl.prop === prop) {
          resolvedValue = decl.value;
        }
      });
      if (!resolvedValue) {
        return closest(container.parent, prop);
      }
      if (resolvedValue.indexOf('@') === -1) {
        return resolvedValue;
      }
      return resolvedValue.replace(
        lookupPattern,
        resolveLookup.bind(this, container)
      );
    }
  };
}

function eachDecl(container, callback) {
  container.nodes.forEach(node => {
    if (node.type === 'decl') {
      callback(node);
    }
  });
}
