///<reference path="../node_modules/postcss/postcss.d.ts" />
import postcss from 'postcss';

const plugin = 'postcss-property-lookup';
const errorContext = { plugin };
const defaultOptions = <PostCssPropertyLookup.Options>{
	logLevel: 'error'
};

export default postcss.plugin<PostCssPropertyLookup.Options>(plugin, (options = defaultOptions) => {

	const log = {
		warn: (message: string, rule: postcss.Rule, result: postcss.Result) => {
			rule.warn(result, message);
		},
		error: (message: string, rule: postcss.Rule) => {
			throw rule.error(message, errorContext);
		}
	}[options.logLevel];

	if (!log) {
		throw new Error(`Invalid logLevel: ${options.logLevel}`);
	}

	const lookupPattern = /@([a-z-]+)\b/g;

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

		function resolveLookup(rule: postcss.Rule, orig: string, prop: string) {
			const resolvedValue = closest(rule, prop);
			if (!resolvedValue) {
				log(`Unable to find property ${orig} in ${rule.selector}`, rule, result);
			}
			return resolvedValue;
		}

		function closest(container: postcss.Container, prop: string) {
			if (!container) {
				return '';
			}
			let resolvedValue: string;
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
});

function eachDecl(
	container: postcss.Container,
	callback: (decl: postcss.Declaration) => void
) {
	container.nodes.forEach(node => {
		if (node.type === 'decl') {
			callback(<postcss.Declaration>node);
		}
	});
}

export module PostCssPropertyLookup {
	export interface Options {
		/**
		 * When a lookup cannot be resolved, this specifies whether to throw an
		 * error or log a warning. In the case of a warning, the invalid lookup
		 * value will be replaced with an empty string.
		 */
		logLevel?: string;
	}
}
