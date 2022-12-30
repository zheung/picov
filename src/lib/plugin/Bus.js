import { reactive } from 'vue';

export const B = reactive({});

export const install = function(app) {
	app.mixin({ data() { return { B }; } });

	app.provide('B', B);
};