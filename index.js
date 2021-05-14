const t = require('tcomb');

const plugin = 'postcss-property-lookup';
const lookupPattern = /@\(?([a-z-]+)\)?\b/g;

const LogLevel = t.enums.of(['error', 'warn'], 'LogLevel');
const PluginOptions = t.struct(
  {
    logLevel: LogLevel,
  },
  'PluginOptions'
);

const defaultOptions = {
  logLevel: 'warn',
};

function resolveLookup(rule, orig, prop, log, result) {
  const resolvedValue = closest(rule, prop, log, result);

  if (!resolvedValue) {
    log(`Unable to find property ${orig} in ${rule.selector}`, rule, result);
  }

  return resolvedValue;
}

function eachDecl(container, callback) {
  container.each((node) => {
    if (node.type === 'decl') {
      callback(node);
    }
    // Recurse through child declarations of a media rule
    if (node.type === 'atrule') {
      eachDecl(node, callback);
    }
  });
}

function closest(container, prop, log, result) {
  if (!container) {
    return '';
  }
  let resolvedValue;

  eachDecl(container, (decl) => {
    if (decl.prop === prop) {
      resolvedValue = decl.value;
    }
  });

  // Ignore a reference to itself
  // e.g a {color: @color;}
  if (resolvedValue && resolvedValue.replace('@', '') === prop) {
    return '';
  }

  if (!resolvedValue) {
    return closest(container.parent, prop, log, result);
  }

  if (resolvedValue.indexOf('@') === -1) {
    return resolvedValue;
  }

  return resolvedValue.replace(
    lookupPattern,
    (orig, property) => resolveLookup(container, orig, property, log, result)
  );
}

module.exports = function propertyLookup(options) {
  const errorContext = {plugin};
  options = new PluginOptions(Object.assign({}, defaultOptions, options));

  const log = {
    warn(message, rule, result) {
      rule.warn(result, message);
    },
    error(message, rule) {
      throw rule.error(message, errorContext);
    },
  }[options.logLevel];

  if (!log) {
    throw new Error(`Invalid logLevel: ${options.logLevel}`);
  }

  return {
    postcssPlugin: plugin,
    Rule(rule, {result}) {
      eachDecl(rule, (decl) => {
        if (decl.value.indexOf('@') === -1) {
          return;
        }
        decl.value = decl.value.replace(
          lookupPattern,
          (orig, property) => resolveLookup(rule, orig, property, log, result)
        );
      });
    },
  };
};

module.exports.postcss = true;

