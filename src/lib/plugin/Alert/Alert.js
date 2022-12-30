import { createApp } from 'vue';

import windowAlert from './Alert.vue';

const plugin = { instance: null };


const showBox = function(content = '', title = '提示', cancel = 0, button1 = {}, button2 = {}, button3 = {}, colorTop) {
	if(!plugin.instance) { return; }

	plugin.instance.title.value = String(title);
	plugin.instance.content.value = String(content);

	plugin.instance.button1.value = button1;
	plugin.instance.button2.value = button2;
	plugin.instance.button3.value = button3;
	plugin.instance.cancel.value = cancel;

	plugin.instance.colorTop.value = colorTop;

	return new Promise(function(resolve) {
		plugin.instance.waiter.value = resolve;
		plugin.instance.show.value = true;
	});
};


export const $alert = function(content, title = '提示',
	button1 = { text: '确定', value: true },
	button2,
	button3,
	cancel = 1,
	colorTop
) {
	return showBox(content, title, cancel, button1, button2, button3, colorTop);
};
export const $quest = function(content, title = '提示',
	button1 = { text: '是', value: true },
	button2 = { text: '否', value: false, reverse: true },
	button3,
	cancel = 2,
	colorTop
) {
	return showBox(content, title, cancel, button1, button2, button3, colorTop);
};
export const $quest3 = function(content, title = '提示',
	button1 = { text: '是', value: true },
	button2 = { text: '否', value: false, },
	button3 = { text: '取消', value: 'cancel', reverse: true },
	cancel = 3,
	colorTop
) {
	return showBox(content, title, cancel, button1, button2, button3, colorTop);
};

export const $okay = function(action = '操作', title = '成功', next, button1 = { text: '确定', value: true }, button2, button3, cancel = 0, colorTop = '$okay') {
	const content = `${action}成功${next ? `。${next}` : ''}`;

	return showBox(content, title, cancel, button1, button2, button3, colorTop);
};
export const $fail = function(action = '操作', error, title = '失败', button1 = { text: '确定', value: true }, button2, button3, cancel = 0, colorTop = '$fail') {
	const content = (`${action}失败，原因：${error?.message ?? error ?? '未知'}`);

	return showBox(content, title, cancel, button1, button2, button3, colorTop);
};


export const install = async function(app) {
	const appAlert = createApp(windowAlert);
	appAlert.provide('$plugin', plugin);

	(await import('../Brop.js')).install(appAlert);

	const domAlert = document.createElement('div');
	document.body.appendChild(domAlert);
	appAlert.mount(domAlert);


	app.provide('$alert', $alert);
	app.provide('$quest', $quest);
	app.provide('$quest3', $quest3);
	app.provide('$okay', $okay);
	app.provide('$fail', $fail);
};