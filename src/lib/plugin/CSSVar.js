export const install = function(app) {
	const HTML = document.documentElement;

	const CV = Object.freeze({
		set(key, value, scope = HTML) { scope.style.setProperty(`--${key}`, value); },
		get(key, scope = HTML) { return scope.style.getPropertyValue(`--${key}`); },
		del(key, scope = HTML) { return scope.style.removeProperty(`--${key}`); },
		setAll(values, scope = HTML) { for(const key in values) { CV.set(key, values[key], scope); } },
	});

	app.provide('CV', CV);
};