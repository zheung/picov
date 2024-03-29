<template>
	<p-illust
		ref="elIllust"
		v-menu="{ params: illust, ...menuIllust }"
		:title="title"
		:data-index="props.illustIndex"
		:style="{ backgroundImage: isSeen ? backgroundImage : false }"
		:safe-background="brop(isSafe)"
		:tabindex="tabIndex"
		@mousedown.middle.prevent.stop="openAuthor(illust)"
		@click.exact="onClick(illust)"
		@click.ctrl="IA.save(illust, true)"
	>
		<template v-if="isFetched(illust)">
			<progress :max="100" :value="100" />
		</template>
		<template v-else>
			<progress :max="IA.state[illust.iid]?.progMax ?? 0" :value="IA.state[illust.iid]?.prog ?? 0" />
		</template>

		<p-title
			:title="illust.title"
			:multi="brop(illust.count > 1)"
			:ugoira="brop(illust.type == 2)"
		>
			{{ illust.count > 1 ? `(${illust.count})` : '' }} {{ props.illust.typeAI == 2 ? '[AI]' : '' }} {{ illust.title }}
		</p-title>

		<p-state v-if="IA.state[illust.iid]?.L" :title="IA.state[illust.iid]?.L">{{ IA.state[illust.iid]?.L }}</p-state>
		<p-state v-if="IA.state[illust.iid]?.R" right :title="IA.state[illust.iid]?.R">{{ IA.state[illust.iid]?.R }}</p-state>

		<img thumb :src="props.illust.urlThumb" loading="lazy" @load="isSeen = true" />
	</p-illust>
</template>

<script setup>
	import { computed, inject, onMounted, ref } from 'vue';

	import { faUserEdit, faVideo } from '@fortawesome/free-solid-svg-icons';
	import Clipboard from 'clipboard';



	const props = defineProps({
		illust: { type: Object, default: () => ({}) },
		illustIndex: { type: Number, default: null },
		tabIndex: { type: Number, default: null },
	});


	/** @type {import('vue').Ref<import('../../../../lib/TabAdmin.js').default>} */
	const TA = inject('tabAdmin');
	/** @type {import('vue').Ref<import('../../admin/IllustAdmin.js').default>} */
	const IA = inject('illustAdmin');


	const isSafe = new URLSearchParams(location.search).get('safe') == 'true';
	const isSeen = ref(false);
	const backgroundImage = computed(() => {
		if(!props.illust.urlThumb) { return; }

		return `url(${props.illust.urlThumb})`;
	});


	const textAI = computed(() =>
		props.illust.typeAI > 2
			? `AI类型：${props.illust.typeAI}`
			: (
				props.illust.typeAI == 2
					? '● AI作品'
					: ''
			)
	);
	const title = computed(() => `
		${props.illust.iid}
		● 标题：${props.illust.title}
		● 作者：${props.illust.user}（${props.illust.uid}）
		● 标签：${props.illust.tags.join('、')}
		${textAI.value}
	`.replace(/\t/g, '').trim());


	const isFetched = (illust) => IA.value.state[illust.iid]?.fetch == 1;

	const atPlay = illust => TA.value.addIcon(`【动画】${illust.iid}`, faVideo, 'ugoira', 'pixiv-illust-view-Ugoira', illust);
	const atOpen = async illust => {
		const tabLocalGallery = Object.values(TA.value.map).find(tab => tab.typeList == 'local-gallery');
		if(!tabLocalGallery) { return; }

		await tabLocalGallery.info.atFetch();

		const index = tabLocalGallery.info.files.findIndex(file => file.startsWith(illust.iid));

		if(index + 1) {
			tabLocalGallery.info.indexNow = index;

			TA.value.change(tabLocalGallery);
		}
	};

	const onClick = (illust) => {
		return !isFetched(illust) ?
			IA.value.save(illust) :
			(
				illust.type == 2 ?
					atPlay(illust) :
					atOpen(illust)
			);
	};


	const openAuthor = illust => TA.value.addIcon(`【作者】${illust.uid}`, faUserEdit, 'user', 'pixiv-illust-list-User', illust.uid);

	const menuIllust = {
		useLongPressInMobile: true,
		menuWrapperCss: { background: 'snow', borderRadius: '4px' },
		menuItemCss: { hoverBackground: '#bfdbfe' },
		menuList: [
			{
				label: '▶️ 播放动画',
				hidden: illust => illust.type != 2,
				fn: atPlay,
			},
			{
				label: '✔ 保留',
				hidden: illust => illust.type != 2,
				fn: illust => IA.value.keepUgoira(illust.iid)
			},
			{
				label: '✖ 删除',
				hidden: illust => illust.type != 2,
				fn: illust => IA.value.deleteUgoira(illust.iid)
			},
			{ line: true, hidden: illust => illust.type != 2 },
			{
				label: '📂 浏览作者 ...',
				fn: openAuthor,
			},
			{
				label: '⏬ 强制下载',
				fn: illust => IA.value.save(illust, true),
			},
			{ line: true },
			{
				label: '🔗 作品页',
				fn: illust => window.open(`https://www.pixiv.net/artworks/${illust.iid}`),
			},
			{
				label: '🔗 作者主页',
				fn: illust => window.open(`https://www.pixiv.net/users/${illust.uid}/illustrations`),
			},
			{ line: true },
			{
				label: '📝 复制ID',
				fn: illust => Clipboard.copy(String(illust.iid)),
			},
			{
				label: '📝 复制作者ID',
				fn: illust => Clipboard.copy(String(illust.uid))
			},
		]
	};


	const elIllust = ref();


	const emit = defineEmits(['mounted']);
	onMounted(() => emit('mounted', elIllust.value, props.illust, props.illustIndex));
</script>

<style lang="sass" scoped>
p-illust
	@apply inblock relative bg-green-200 bg-no-repeat bg-left-top bg-cover text-center cursor-pointer

	scroll-snap-align: start

	transition-property: all
	transition-duration: 0.4s
	transform: translateZ(0)

	&:hover
		@apply bg-right-bottom

	&[safe-background]
		@apply bg-blend-hue

	max-height: calc(100% / 3)

	width: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 3)
	height: calc(100% / 4)

	@media (min-width: 768px)
		width: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 4)
		height: calc(100% / 4)

	@media (min-width: 1280px)
		width: calc((100vw - var(--widthSidebar) - var(--widthScroll)) / 5)
		height: calc(100% / 3)

	p-title
		@apply relative block w-full h-6 leading-6 px-4 elli select-none
		color: var(--cTextBack)

		&:hover
			@apply text-black

		&[multi]
			@apply text-yellow-500
		&[ugoira]
			@apply text-purple-600

	progress
		@apply absolute w-full h-6 left-0 top-0 opacity-90

		&::-webkit-progress-bar
			background-color: var(--cBack)
		&::-webkit-progress-value
			background-color: var(--cOkay)

	p-state
		@apply relative inblock float-left text-xs py-1 px-1 elli select-none opacity-70
		max-width: 50%
		color: var(--cTextBack)
		background-color: var(--cBack)

		&[right]
			@apply float-right

	[thumb]
		@apply absolute w-[1px] h-[1px]
</style>
