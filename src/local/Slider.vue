<template>
	<module ref="domBox" class="w-full overflow-x-hidden overflow-y-hidden">
		<canvas ref="domCanvas" v-menu="menuUgoira" tabindex="1" :grab="brop(isMouseDown)"
			@keydown.exact="onKeyDown"
			@wheel="onWheel"
			@mousedown.middle.prevent.stop="searchAuthor(iidNow)"
			@mousedown="onMouseDown"
			@mouseup="onMouseUp"
			@mousemove.exact="onMouseMove"
		/>
		<p-info>
			<div>{{ `${I.indexNow + 1}/${I.files?.length ?? 0}` }}</div>
			<template v-if="I.imgNow?.file">
				<template v-if="/^[1-9]\d*_p\d+\./.test(I.imgNow.file)">
					<div>{{ I.imgNow.file.split('_p')[0] }}</div>
					<div>第{{ Number(I.imgNow.file.split('_p')[1].split('.')[0]) + 1 }}张</div>
				</template>
				<div v-else>{{ I.imgNow.file }}</div>
			</template>
		</p-info>
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onMounted, ref, watch } from 'vue';

	import { faListOl, faUserEdit } from '@fortawesome/free-solid-svg-icons';
	import Clipboard from 'clipboard';

	import { Tab } from '../lib/TabAdmin.js';



	/** @type {import('vue').Ref<import('../lib/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../pixiv/illust/admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');


	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const fileNow = computed(() => I.value.files?.[I.value.indexNow]);
	const caches = ref({});

	watch(fileNow, file => {
		const info = I.value;

		info.zoom = 100;
		info.offsetWidth = 0;
		info.offsetHeight = 0;


		if(caches[file]) { return loadImage(caches[file]); }


		caches[file] = new Image();
		caches[file].addEventListener('load', () => loadImage(caches[file]));
		caches[file].src = `./api/local/illust/file?location=archive&file=${file}`;
		caches[file].file = file;
	});


	const stateFetch = ref(0);
	const atFetch = async (step_ = 0) => {
		const tabNow = now.value;
		const info = tabNow.info;


		stateFetch.value = 1;
		try {
			const file = fileNow.value;

			info.files = await IA.value.getLocalIllustFiles('archive', false);

			const indexNew = info.files.indexOf(file);
			info.indexNow = indexNew == -1 ? 0 : indexNew;

			stateFetch.value = 2;
		}
		catch(error) {
			stateFetch.value = 3;

			throw error;
		}
	};

	onMounted(() => TA.value.emitChange());

	TA.value.addChanger('local-slider', async tab_ => {
		const tab = tab_;


		now.value = tab;


		const info = tab.info;


		if(!info.isInit) {
			info.isInit = true;

			info.indexNow = -1;
			info.imgNow = null;

			info.zoom = 100;
			info.offsetWidth = 0;
			info.offsetHeight = 0;

			info.lastLeft = 0;
			info.lastTop = 0;
			info.lastFinalWidth = 0;
			info.lastFinalHeight = 0;

			info.atFetch = atFetch;

			atFetch();
		}
	});


	let intervalSlide = null;
	let intervalFetch = null;

	const startInterval = () => {
		if(!intervalSlide) {
			intervalSlide = setInterval(() => {
				const info = I.value;
				const length = info.files.length;

				info.indexNow = (length + (info.indexNow + 1) % length) % length;
			}, 1000);

		}

		if(!intervalFetch) {
			intervalFetch = setInterval(atFetch, 1000 * 10);
		}
	};
	const stopInterval = () => {
		clearInterval(intervalSlide);
		intervalSlide = null;

		clearInterval(intervalFetch);
		intervalFetch = null;
	};


	const searchAuthor = async iid => {
		const [illust] = await IA.value.fetchIllusts([iid]);

		TA.value.addIcon(`【作者】${illust.uid}`, faUserEdit, 'user', 'pixiv-illust-list-User', illust.uid);
	};


	const iidNow = computed(() => fileNow.value?.split('_')?.[0]);
	const menuUgoira = {
		useLongPressInMobile: true,
		menuWrapperCss: { background: 'snow', borderRadius: '4px' },
		menuItemCss: { hoverBackground: '#bfdbfe' },
		menuList: [
			{
				label: '🔄 刷新',
				fn: atFetch
			},
			{ line: true },
			{
				label: '▶️ 开始',
				fn: startInterval,
				hidden: tab => intervalSlide
			},
			{
				label: '⏹️ 暂停',
				fn: stopInterval,
				hidden: tab => !intervalSlide
			},
			{ line: true },
			{
				label: '📂 搜索作品 ...',
				fn: () => TA.value.addIcon(`【作品】${iidNow.value}`, faListOl, 'number|once', 'pixiv-illust-list-Number', iidNow.value)
			},
			{
				label: '📂 搜索作者 ...',
				fn: () => searchAuthor(iidNow.value)
			},
			{
				label: '📝 复制作品ID',
				fn: () => Clipboard.copy(iidNow.value),
			},
		]
	};


	const domBox = ref(null);
	const domCanvas = ref(null);

	const isMouseDown = ref(false);
	const isMouseMove = ref(false);


	const loadImage = img => {
		if(!img) { return; }

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
	};

	const onWheel = e => {
		const info = I.value;

		if(e.altKey) {
			if(e.deltaY > 0 && info.zoom - 10 > 0) {
				info.zoom = info.zoom - 10;
			}
			else {
				info.zoom = info.zoom + 10;
			}

			loadImage(info.imgNow);
		}
		else {
			const index = info.indexNow + (e.deltaY > 0 ? 1 : -1);
			const length = info.files.length;

			info.indexNow = (length + index % length) % length;
		}
	};
	const onMouseDown = event => {
		const button = event.button;

		// 左键: 移动画片
		if(button == 0) {
			isMouseDown.value = true;
			isMouseMove.value = false;
		}
	};
	const onMouseUp = event => {
		isMouseDown.value = false;
	};
	const onMouseMove = event => {
		const info = I.value;

		if(isMouseDown.value && event.button == 0) {
			isMouseMove.value = true;

			info.offsetHeight += event.movementY;
			info.offsetWidth += event.movementX;

			loadImage(info.imgNow);
		}
	};


	const onKeyDown = event => {
		const info = I.value;

		// +：放大
		if(event.keyCode == 107) {
			info.zoom += 20;
		}
		// -：缩小
		else if(event.keyCode == 109 && info.zoom - 10 > 0) {
			info.zoom -= 20;
		}
		// *: 还原缩放
		else if(event.keyCode == 106) {
			info.zoom = 100;
		}
		// home: 第一张
		else if(event.keyCode == 36) {
			info.indexNow = 0;
		}
		// end: 最后一张
		else if(event.keyCode == 35) {
			info.indexNow = info.files.length - 1;
		}
		// shift+r: 刷新
		else if(event.keyCode == 82 && event.shiftKey) {
			atFetch();
		}
		// 上下左右：图片平移
		else if([37, 38].includes(event.keyCode)) {
			const off = event.ctrlKey ? 100 : (event.altKey ? 1 : 10);
			info.offsetWidth -= off;
		}
		else if([39, 40].includes(event.keyCode)) {
			const off = event.ctrlKey ? 100 : (event.altKey ? 1 : 10);
			info.offsetWidth += off;
		}


		loadImage(info.imgNow);
	};

	onActivated(() => domCanvas.value?.focus());
</script>

<style lang="sass" scoped>
module
	height: 100vh

canvas[grab]
	@apply outline-none select-none cursor-grab

p-info
	@apply block absolute left-0 bottom-0 rounded-tr-md p-0.5 text-sm bg-[var(--cBack)]
</style>
