import postcss from 'postcss';

const plugin = 'postcss-property-lookup';
const lookupPattern = /@([a-z-]+)(\s?)/g;
const defaultOptions = {
  logLevel: 'warn'
};

export default postcss.plugin(plugin, propertyLookup);

function propertyLookup(options = defaultOptions) {
  const errorContext = { plugin };

  const log = {
    warn: (message, rule, result) => {
      rule.warn(result, message);
    },
    error: (message, rule) => {
      throw rule.error(message, errorContext);
    }
  }[options.logLevel];

  if (!log) {
    throw new Error(`Invalid logLevel: ${options.logLevel}`);
  }

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
        log(`Unable to find property ${orig} in ${rule.selector}`, rule, result);
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
