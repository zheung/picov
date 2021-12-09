<template>
	<comp-mask v-show="showMask" />
	<comp-alert v-show="show" ref="win"
		:style="{
			top: top+'px',
			left: left+'px',
			borderColor: styleColorTop,
		}"
		:color="attrColorTop"
	>
		<p-title class="block w-full h-6 nosel"
			:style="{ cursor: moving ? 'move' : 'default' }"
			@mousemove="onMouseMove" @mousedown="onMoveStart" @mouseup="onMoveEnd" @mouseout="onMoveEnd"
		>
			<p-title-text class="inblock elli text-lg leading-6 px-1">{{title || '提示'}}</p-title-text>
		</p-title>
		<p-body class="block">
			<p-body-content class="block w-full m-4 pr-8 text-sm">{{content || ''}}</p-body-content>
			<p-body-clicks class="w-full pt-2 pl-8 flex flex-row-reverse gap-2">
				<Click v-if="button3 && button3.text" tabindex="1403" :reverse="brop(button3.reverse)"
					:text="button3.text" :color="attrColorTop"
					@click="atClick(button3.value)"
					@keydown.enter.space.prevent="atClick(button3.value)"
					@keydown.esc.prevent="atClick(button1.value, true)"
				/>
				<Click v-if="button2 && button2.text" tabindex="1402" :reverse="brop(button2.reverse)"
					:text="button2.text" :color="attrColorTop"
					@click="atClick(button2.value)"
					@keydown.enter.space.prevent="atClick(button2.value)"
					@keydown.esc.prevent="atClick(button1.value, true)"
				/>
				<Click v-if="button1 && button1.text" tabindex="1401" :reverse="brop(button1.reverse)"
					:text="button1.text" :color="attrColorTop"
					@click="atClick(button1.value)"
					@keydown.enter.space.prevent="atClick(button1.value)"
					@keydown.esc.prevent="atClick(button1.value, true)"
				/>
			</p-body-clicks>
		</p-body>
	</comp-alert>
</template>

<script setup>
	import { computed, inject, nextTick, onBeforeMount, ref, watch } from 'vue';

	import Click from '../../comp/Click.vue';


	const $plugin = inject('$plugin');

	const moving = ref(false);
	const top = ref(0);
	const left = ref(0);

	const title = ref(null);
	const content = ref(null);

	const cancel = ref(0);
	const button1 = ref({ text: null, value: null, reverse: true });
	const button2 = ref({ text: null, value: null, reverse: true });
	const button3 = ref({ text: null, value: null, reverse: true });

	const colorTop = ref(null);
	const styleColorTop = computed(() => colorTop.value?.startsWith('$') ? false : (colorTop.value ?? false));
	const attrColorTop = computed(() => colorTop.value?.startsWith('$') ? colorTop.value.replace('$', '').toLowerCase() : null);

	const show = ref(false);
	const waiter = ref(null);

	const showMask = ref(false);

	const win = ref(null);

	onBeforeMount(() => $plugin.instance = {
		title,
		content,
		cancel,
		button1,
		button2,
		button3,
		colorTop,
		waiter,
		show,
	});

	watch(show, now => {
		if(now) {
			nextTick(() => {
				top.value = (window.innerHeight - win.value.clientHeight) / 2;
				left.value = (window.innerWidth - win.value.clientWidth) / 2;

				nextTick(() => win.value.querySelector('comp-click:last-child').focus());
			});

			showMask.value = true;
		}
	});

	const atClick = (value, fromCancel = false) => {
		if(fromCancel) {
			if(!cancel.value) { return; }
			else if(cancel.value == 1) { value = button1.value; }
			else if(cancel.value == 2) { value = button2.value; }
			else if(cancel.value == 3) { value = button3.value; }
		}


		title.value = null;
		content.value = null;

		cancel.value = 0;
		button1.value = { text: null, value: null, reverse: true };
		button2.value = { text: null, value: null, reverse: true };
		button3.value = { text: null, value: null, reverse: true };

		show.value = false;
		showMask.value = false;

		if(typeof waiter.value == 'function') {
			try {
				waiter.value(value);
			}
			finally {
				waiter.value = null;
			}
		}
	};

	const onMouseMove = e => {
		if(e.buttons == 1) {
			top.value += e.movementY;
			left.value += e.movementX;
		}
	};
	const onMoveStart = () => moving.value = true;
	const onMoveEnd = () => moving.value = false;
</script>

<style lang="sass" scoped>
comp-mask
	@apply fixed top-0 bottom-0 left-0 right-0 z-30
	background: rgba(192, 192, 192, 0.4)

comp-alert
	@apply fixed p-2 overflow-hidden shadow-2xl rounded-sm z-40 border-t-8
	min-width: 160px
	min-height: 90px
	background-color: var(--colorBackground)
	border-color: var(--colorMain)

	&[color=okay]
		border-color: var(--colorOkay)
	&[color=fail]
		border-color: var(--colorFail)

	comp-click
		@apply inblock h-8 leading-8 px-4 outline-none focus:font-bold

		&[color=okay]
			background-color: var(--colorOkay)
		&[color=fail]
			background-color: var(--colorFail)

		&[reverse]
			@apply border border-gray-300
			background-color: var(--colorBackGround)
			color: var(--colorText)

p-button
	@apply w-16 h-7 ml-2 leading-7 bg-green-500 inline-block align-top rounded-sm cursor-pointer text-sm text-center overflow-hidden outline-none select-none hover:shadow-md filter hover:brightness-110 focus:brightness-125
</style>