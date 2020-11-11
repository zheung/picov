import Vue from 'Vue';

const B = Vue.observable({
	// 空函数 Eunc
	eunc() { },
	// Vue
	Vue,

	// 工具
	tool: {
		random: {
			int(max, min = 0) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			},
			arr(arr, max = arr.length, min = 0) {
				return Object.values(arr)[Math.floor(Math.random() * (max - min + 1)) + min];
			}
		}
	}
});

Vue.config.devtools = false;

// 新组件自动注册组件总线
Vue.mixin({
	data() { return { B }; },
});

export default B;