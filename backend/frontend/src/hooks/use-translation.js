import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation as useBaseTranslation, Trans as BaseTranslation } from 'react-i18next';

function buildI18nKey({ basePath, key, namespace } = {}) {
	const namespacePrefix = namespace ? `${namespace}:` : '';
	const keyPrefix = basePath ? `${basePath}.` : '';
	return `${namespacePrefix}${keyPrefix}${key}`;
}

/**
 * Translation component can be used for jsx interpolation/substitution.
 * See for more details: https://react.i18next.com/latest/trans-component
 * Component props:
 * intlKey - string key, same that would be used for `translate(intlKey)`
 * components - array of jsx nodes, index corresponds to json <#> </#> tag
 * Ex: <0>Terms</0> <1>Continue</1> can be converted to <a href="/terms">Terms</a> <button>Continue</button>
 * @param basePath - provided by useTranslation hook
 * @param namespace - provided by useTranslation hook
 * @returns {React.Component}
 */
function useTranslationComponent({ basePath, namespace }) {
	return useMemo(() => {
		const TranslationComponent = React.memo(({ intlKey, ...rest }) => (
			<BaseTranslation
				i18nKey={buildI18nKey({ basePath, key: intlKey, namespace })}
				{...rest}
			/>
		));

		TranslationComponent.displayName = 'Translation';
		TranslationComponent.propTypes = {
			intlKey: PropTypes.string.isRequired,
			components: PropTypes.object,
			values: PropTypes.object,
		};

		return TranslationComponent;
	}, [basePath, namespace]);
}

/**
 * Facade-esque hook for react-i18n useTranslation hook, primarily the `t` function.
 * Returned `translate` function can be used with basic string interpolation - for JSX interpolation, use Translate Component
 * Ex: json: "friendlyWelcome": "Hello {{name}}!" | code: translate('friendlyWelcome', { name: 'Fred' }) | output: Hello Fred!
 * @param namespace - string - optional - Attempts to resolve from default namespace if not provided
 * @param basePath - string - optional - shorthand for easily accessing nested lang values
 * @param options - pass-through params to react-i18n useTranslation options param
 * @return Object
 */
function useTranslation({
	basePath = '',
	namespace = '',
	...options
} = {}) {
	const { t, ...rest } = useBaseTranslation(namespace, options);
	const Translation = useTranslationComponent({ basePath, namespace });

	const translate = useCallback((key, intlProps) => {
		return t(buildI18nKey({ basePath, key, namespace }), intlProps);
	}, [t, namespace, basePath]);

	return useMemo(() => ({
		Translation,
		translate,
		...rest,
	}), [Translation, rest, translate]);
}

export default useTranslation;
