<template>
	<module ref="domBox" class="w-full overflow-x-hidden overflow-y-hidden">
		<canvas ref="domCanvas" v-menu="menuUgoira" tabindex="1" :grab="brop(isMouseDown)"
			@keydown.exact="onKeyDown"
			@wheel.exact="onWheel"
			@mousedown.left="onMouseDown"
			@mouseup.left="onMouseUp"
			@mousemove.exact="onMouseMove"
		/>
	</module>
</template>

<script setup>
	import Clipboard from 'clipboard';
	import { unzipSync } from 'fflate';
	import { computed, inject, onActivated, onDeactivated, onMounted, ref } from 'vue';

	import { Tab } from '../admin/TabAdmin.js';


	const $alert = inject('$alert');
	/** @type {import('../../../lib/plugin/Aegis.js').$get} */
	const $get = inject('$get');


	/** @type {import('vue').Ref<import('../admin/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);

	const menuUgoira = {
		useLongPressInMobile: true,
		menuWrapperCss: { background: 'snow', borderRadius: '4px' },
		menuItemCss: { hoverBackground: '#bfdbfe' },
		menuList: [
			{
				label: '✔ 保留并关闭',
				hidden: () => I.value.isSaved,
				fn: () => { IA.value.keepUgoira(I.value.illust.iid); TA.value.del(now.value); }
			},
			{
				label: '✖ 删除并关闭',
				hidden: () => I.value.isSaved,
				fn: () => { IA.value.deleteUgoira(I.value.illust.iid); TA.value.del(now.value); }
			},
			{
				label: '🚪 关闭',
				hidden: () => !I.value.isSaved,
				fn: () => TA.value.del(now.value)
			},
			{ line: true, hidden: () => I.value.isSaved },
			{
				label: '✔ 保留',
				hidden: () => I.value.isSaved,
				fn: () => IA.value.keepUgoira(I.value.illust.iid)
			},
			{
				label: '✖ 删除',
				hidden: () => I.value.isSaved,
				fn: () => IA.value.deleteUgoira(I.value.illust.iid)
			},

			{ line: true },
			{
				label: '📂 搜索作品 ...',
				fn: () => TA.value.addIcon(`【作品】${I.value.illust.iid}`, 'paint-brush', 'number', 'pixiv-illust-list-Number', I.value.illust.iid)
			},
			{
				label: '📝 复制作品ID',
				fn: () => Clipboard.copy(String(I.value.illust.iid)),
			},
		]
	};


	const domBox = ref(null);
	const domCanvas = ref(null);

	const isMouseDown = ref(false);
	const isMouseMove = ref(false);


	const loadImage = img => {
		const info = I.value;

		info.imgNow = img;

		const ctx = domCanvas.value.getContext('2d');
		const box = domBox.value;

		const boxWidth = box.offsetWidth - 1;
		const boxHeight = box.offsetHeight - 1;

		const imgWidth = img.width;
		const imgHeight = img.height;


		let finalWidth = imgWidth;
		let finalHeight = imgHeight;


		ctx.clearRect(info.lastLeft, info.lastTop, info.lastFinalWidth, info.lastFinalHeight);

		ctx.canvas.width = boxWidth;
		ctx.canvas.height = boxHeight;

		if(finalWidth < boxWidth) {
			const diff = 1 - (finalWidth - boxWidth) / finalWidth;

			finalWidth = ~~(diff * finalWidth);
			finalHeight = ~~(diff * finalHeight);
		}

		if(finalHeight < boxHeight) {
			const diff = 1 - (finalHeight - boxHeight) / finalHeight;


			finalWidth = ~~(diff * finalWidth);
			finalHeight = ~~(diff * finalHeight);
		}

		if(finalWidth > boxWidth) {
			const diff = 1 - (finalWidth - boxWidth) / finalWidth;

			finalWidth = ~~(diff * finalWidth);
			finalHeight = ~~(diff * finalHeight);
		}

		if(finalHeight > boxHeight) {
			const diff = 1 - (finalHeight - boxHeight) / finalHeight;

			finalWidth = ~~(diff * finalWidth);
			finalHeight = ~~(diff * finalHeight);
		}


		info.lastLeft = (boxWidth - finalWidth) / 2 + info.offsetWidth - finalWidth * ((info.zoom / 100 - 1) / 2);
		info.lastTop = (boxHeight - finalHeight) / 2 + info.offsetHeight - finalHeight * ((info.zoom / 100 - 1) / 2);

		info.lastFinalWidth = finalWidth * info.zoom / 100;
		info.lastFinalHeight = finalHeight * info.zoom / 100;


		ctx.drawImage(img, info.lastLeft, info.lastTop, info.lastFinalWidth, info.lastFinalHeight);

		ctx.font = '14px bold';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		ctx.fillText(info.frames.length - info.indexNow, boxWidth - 24, boxHeight - 14);
	};

	const onSwitch = () => {
		if(I.value.isPlaying) { pause(); }
		else { play(I.value.indexNow); }
	};
	const pause = () => {
		clearTimeout(I.value.timer);

		I.value.isPlaying = false;
	};
	const play = (nowPos = 0) => {
		const info = I.value;

		const frames = info.frames;

		if(nowPos >= frames.length) { nowPos = 0; }

		const frameNow = frames[nowPos];

		info.indexNow = nowPos;

		loadImage(frameNow.img);

		info.timer = setTimeout(() => play(nowPos + 1), frameNow.delay);
		info.isPlaying = true;
	};

	const initPlayer = async () => {
		const info = I.value;
		const illust = info.illust;
		const iid = illust.iid;


		clearTimeout(info.timer);


		info.indexNow = 0;


		const frames = info.frames;
		if(!frames) { return $alert(`动画（${iid}）缺少序列信息`); }

		let zipBuffer;
		try {
			zipBuffer = await $get(`ugoira-new/ugoira-${iid}.zip`, {}, { responseType: 'arraybuffer', prefix: '', return: 'raw' });
		}
		catch(error) {
			zipBuffer = await $get(`ugoira-saved/ugoira-${iid}.zip`, {}, { responseType: 'arraybuffer', prefix: '', return: 'raw' });
			info.isSaved = true;
		}


		const imagesUint8Array = await unzipSync(new Uint8Array(zipBuffer));
		const infosImage = Object.entries(imagesUint8Array).reduce((obj, [name, array]) => {
			obj[name] = URL.createObjectURL(new Blob([array], { type: 'image/*' }));

			return obj;
		}, {});

		await Promise.all(frames.map((frame, index) => {
			frame.index = index;
			frame.next = frames[index + 1] ?? frames[0];
			frame.url = infosImage[frame.file];

			return new Promise(resolve => {
				frame.img = new Image();
				frame.img.addEventListener('load', resolve);
				frame.img.src = frame.url;
			});
		}));
	};



	const onWheel = e => {
		const info = I.value;

		if(e.deltaY > 0 && info.zoom - 10 > 0) {
			info.zoom = info.zoom - 10;
		}
		else {
			info.zoom = info.zoom + 10;
		}

		loadImage(info.imgNow);
	};
	const onMouseDown = () => {
		isMouseDown.value = true;
		isMouseMove.value = false;
	};
	const onMouseUp = () => {
		if(isMouseDown.value && !isMouseMove.value) {
			isMouseDown.value = false;
			onSwitch();
		}
	};
	const onMouseMove = e => {
		const info = I.value;

		if(isMouseDown.value && e.buttons == 1) {
			isMouseMove.value = true;

			info.offsetHeight += e.movementY;
			info.offsetWidth += e.movementX;

			loadImage(info.imgNow);
		}
	};




	const onKeyDown = event => {
		const info = I.value;

		// SPACE：播放、暂停
		if(event.keyCode == 32) {
			onSwitch();
		}
		// +：放大
		else if(event.keyCode == 107) {
			info.zoom += 10;
		}
		// -：缩小
		else if(event.keyCode == 109 && info.zoom - 10 > 0) {
			info.zoom -= 10;
		}
		// 上下左右：移动
		else if([37, 38].includes(event.keyCode)) {
			const off = event.ctrlKey ? 100 : (event.altKey ? 1 : 10);
			info.offsetWidth -= off;
		}
		else if([39, 40].includes(event.keyCode)) {
			const off = event.ctrlKey ? 100 : (event.altKey ? 1 : 10);
			info.offsetWidth += off;
		}
	};

	onMounted(() => TA.value.emitChange());

	TA.value.addChanger('ugoira', async tab => {
		const [illustNew] = tab.params;

		const old = now.value;
		const info = tab.info;

		if(tab.typeList == 'ugoira' && (illustNew?.type == 2 || info.illust?.type == 2)) {
			const canvas = domCanvas.value;
			const ctx = canvas?.getContext('2d');

			ctx?.clearRect(0, 0, canvas.width, canvas.height);

			if(old == tab) {
				if(info.isPlaying && info.isDeactive) {
					play(info.indexNow + 1);
				}
				else {
					ctx?.drawImage(info.imgNow, info.lastLeft, info.lastTop, info.lastFinalWidth, info.lastFinalHeight);
				}

				info.isDeactive = false;
			}
			else {
				clearTimeout(old.info.timer);
				old.info.isDeactive = true;

				now.value = tab;

				if(!tab.info.isInit) {
					tab.info.isInit = true;
					info.illust = illustNew;
					info.isSaved = false;

					info.frames = JSON.parse(JSON.stringify(IA.value.state[illustNew.iid]?.files));

					info.indexNow = 0;
					info.imgNow = 0;

					info.timer = null;
					info.isPlaying = true;
					info.isDeactive = false;

					info.zoom = 100;
					info.offsetWidth = 0;
					info.offsetHeight = 0;

					info.lastLeft = 0;
					info.lastTop = 0;
					info.lastFinalWidth = 0;
					info.lastFinalHeight = 0;

					await initPlayer();

					play();
				}
				else if(info.isPlaying && info.isDeactive) {
					play(info.indexNow + 1);
				}
				else {
					ctx?.drawImage(info.imgNow, info.lastLeft, info.lastTop, info.lastFinalWidth, info.lastFinalHeight);
				}

				info.isDeactive = false;
			}
		}
	});


	onActivated(() => domCanvas.value?.focus());
	onDeactivated(() => {
		clearTimeout(I.value.timer);
		I.value.isDeactive = true;
	});
</script>

<style lang="sass" scoped>
module
	height: 100vh
canvas[grab]
	@apply outline-none select-none
	cursor: grab
</style>