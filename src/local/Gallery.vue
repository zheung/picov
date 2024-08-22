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
		<p-info v-if="I.imgNow">
			<template v-if="I.imgNow?.file">
				<div>{{ `${I.imgNow.width}x${I.imgNow.height}` }}</div>
				<div>{{ I.imgNow.file }}</div>
			</template>
			<div>{{ I.indexNow + 1 }}/{{ I.files?.length ?? 0 }}</div>
		</p-info>
		<p-dash>
			<p-dash-button v-for="(dir, title) of dirsArchive$title" :key="`dir-gallery-${title}`"
				v-tip.right="dir" :now="brop(title == titleMain)" @click="titleMain = title"
			>
				{{ title }}
			</p-dash-button>
		</p-dash>
		<p-dash _right>
			<p-dash-button v-tip.left="'复制'" @click="copyFile"><Icon :icon="faCopy" /></p-dash-button>
			<p-dash-button v-tip.left="'舍去'" @click="deleteFile"><Icon :icon="faXmark" /></p-dash-button>
			<p-dash-button v-tip.left="'保留'" @click="keepFile"><Icon :icon="faCheck" /></p-dash-button>
		</p-dash>
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onMounted, ref, watch } from 'vue';

	import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
	import { faListOl, faUserEdit, faCheck, faXmark, faCopy } from '@fortawesome/free-solid-svg-icons';
	import Day from '../lib/day.js';
	import Clipboard from 'clipboard';

	import { $get, $post } from '@nuogz/aegis';
	import { $okay } from '@nuogz/vue-alert';

	import { Tab } from '../lib/TabAdmin.js';



	/** @type {import('vue').Ref<import('../lib/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../pixiv/illust/admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');


	/** @type {import('vue').Ref<import('../picov/profile/info.api.js').Profile>>} */
	const profile = inject('profile');
	const dirsArchive$title = profile.value.dirArchive;

	const timeNow = Day();
	for(const title in dirsArchive$title) {
		dirsArchive$title[title] = dirsArchive$title[title].replace(/<(.*?)(?::(.*?))?>/g, (match, main, paramRaw) => {
			if('title' == main) { return title; }

			if('today' == main) { return timeNow.format(paramRaw); }
			if('yesterday' == main) { return timeNow.add(-1, 'day').format(paramRaw); }
			if('tomorrow' == main) { return timeNow.add(1, 'day').format(paramRaw); }
		});
	}

	const titleMain = ref('今天');








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
		caches[file].src = `./api/local/illust/file?location=prepare&file=${file}`;
		caches[file].file = file;
	});


	const stateFetch = ref(0);
	const atFetch = async (step_ = 0) => {
		const tabNow = now.value;
		const info = tabNow.info;


		stateFetch.value = 1;
		try {
			const file = fileNow.value;

			info.files = await IA.value.getLocalIllustFiles('prepare', false);

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

	TA.value.addChanger('local-gallery', async tab_ => {
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

	const keepFile = async () => {
		const info = I.value;

		IA.value.keepFile(fileNow.value, dirsArchive$title[titleMain.value]);

		const length = info.files.length;
		info.indexNow = (length + (info.indexNow + 1) % length) % length;
	};
	const copyFile = () => {
		const info = I.value;

		IA.value.keepFile(fileNow.value, dirsArchive$title[titleMain.value], true);

		const length = info.files.length;
		info.indexNow = (length + (info.indexNow + 1) % length) % length;
	};
	const deleteFile = () => {
		const info = I.value;

		IA.value.deleteFile(fileNow.value);

		const length = info.files.length;
		info.indexNow = (length + (info.indexNow + 1) % length) % length;
	};
	const deleteFileBefore = async () => {
		const info = I.value;

		await IA.value.deleteFileBatch(info.files.slice(0, info.indexNow));

		return atFetch();
	};


	const searchAuthor = async (iid) => {
		const [illust] = await IA.value.getLocalIllusts([iid], true);

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
				label: '✖ 删除已看',
				fn: deleteFileBefore
			},
			{ line: true },
			{
				label: '✔ 保留',
				fn: keepFile
			},
			{
				label: '✖ 删除',
				fn: deleteFile
			},
			{ line: true },
			{
				label: '✔ 复制到【手动保存】',
				fn: copyFile
			},

			{ line: true },
			{
				label: '⚙️ 修改保存路径',
				fn: async () => {
					const dirIllustArchive = await $get('local/config/dirIllustArchive');

					const dirIllustArchiveNew = prompt('修改作品保存路径', dirIllustArchive);
					await $post('local/config/update-dirIllustArchive', { path: dirIllustArchiveNew });

					$okay('修改作品保存路径成功');
				}
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
			if(e.deltaY > 0 && info.zoom - 40 > 0) {
				info.zoom = info.zoom - 40;
			}
			else {
				info.zoom = info.zoom + 40;
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


		const button = event.button;

		// 后退: 保留
		if(button == 3) {
			event.preventDefault();
			keepFile();
		}
		// 前进: 删除
		else if(button == 4) {
			deleteFile();
		}
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
			info.zoom += 40;
		}
		// -：缩小
		else if(event.keyCode == 109 && info.zoom - 40 > 0) {
			info.zoom -= 40;
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
		// 上下左右：移动
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
	@apply block absolute left-0 top-0 rounded-tr-md p-0.5 text-sm bg-[var(--cBack)]

p-dash
	@apply block absolute left-0 bottom-0

	&[_right]
		@apply left-[unset] right-0

	p-dash-button
		@apply relative block rounded-md text-center shadow-mdd m-2 cursor-pointer outline-none
		@apply w-12 h-12 leading-[calc(var(--spc)*12)] bg-[var(--cBack)]

		&:focus
			@apply ring-2 ring-yellow-500

		&:hover
			@apply font-bold ring-2 ring-yellow-500 text-yellow-500

		&[now]
			@apply ring-2 ring-pink-400
</style>
