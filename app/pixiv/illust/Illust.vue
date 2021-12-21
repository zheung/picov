<template>
	<p-illust
		v-menu="{ params: illust, ...menuIllust }"
		:title="`${illust.iid}\n标题：${illust.title}\n作者：${illust.user}\n标签：${illust.tags.join('、')}`"
		:style="{
			backgroundImage: `url(api/pixiv/illust/thumb?who=${who}&iid=${illust.iid}&time=${illust.time}&type=${illust.type})`,
			zIndex
		}"
		@click.exact="IA.save(illust)"
		@click.ctrl="IA.save(illust, true)"
	>
		<template v-if="S[illust.iid]?.fetch == 1">
			<progress :max="100" :value="100" />
		</template>
		<template v-else>
			<progress :max="S[illust.iid]?.progMax ?? 0" :value="S[illust.iid]?.prog ?? 0" />
		</template>
		<p-title
			:title="illust.title"
			:multi="brop(illust.count>1)"
			:ugoira="brop(illust.type ==2)"
		>
			{{illust.count > 1 ? `(${illust.count})` : ''}} {{illust.title}}
		</p-title>

		<p-state v-if="S[illust.iid]?.L" :title="S[illust.iid]?.L">{{S[illust.iid]?.L}}</p-state>
		<p-state v-if="S[illust.iid]?.R" right :title="S[illust.iid]?.R">{{S[illust.iid]?.R}}</p-state>
	</p-illust>
</template>

<script setup>
	import { inject } from 'vue';

	import Clipboard from 'clipboard';


	defineProps({
		illust: { type: Object, default: () => ({}) },
		zIndex: { type: [Number], default: null },
	});


	const who = inject('who');

	/** @type {import('./admin/IllustAdmin.js').default} */
	const IA = inject('IA');
	const S = IA.state;
	/** @type {import('../admin/TabAdmin.js').default} */
	const TA = inject('TA');

	const $alert = inject('$alert');

	const menuIllust = {
		useLongPressInMobile: true,
		menuWrapperCss: { background: 'snow', borderRadius: '4px' },
		menuItemCss: { hoverBackground: '#bfdbfe', },
		menuList: [
			{
				label: '浏览',
				fn(illust) { TA.addIcon(`【动图】${illust.iid}`, 'video', 'ugoira', 'pixiv-illust-viewer-Ugoira', illust); }
			},
			{
				label: '浏览作者...',
				fn(illust) { TA.addIcon(`【作者】${illust.uid}`, 'user-edit', 'user', 'pixiv-illust-list-User', illust.uid); }
			},
			{ line: true },
			{
				label: '作品页',
				fn(illust) { window.open(`https://www.pixiv.net/artworks/${illust.iid}`); }
			},
			{
				label: '作者主页',
				fn(illust) { window.open(`https://www.pixiv.net/users/${illust.uid}/illustrations`); }
			},
			{ line: true },
			{
				label: '复制ID',
				fn(illust) {
					const clipboard = new Clipboard(document.documentElement, { text: () => illust.iid });
					clipboard.on('success', () => { clipboard.destroy(); });
					clipboard.on('error', () => { clipboard.destroy(); $alert(`复制失败${illust.iid}`); });
					clipboard.onClick();
				}
			},
		]
	};
</script>

<style lang="sass" scoped>
p-illust
	@apply inblock relative bg-green-200 bg-no-repeat bg-top bg-cover bg-auto text-center cursor-pointer bg-blend-hue

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
		color: var(--colorText)

		&:hover
			@apply text-black

		&[multi]
			@apply text-yellow-500
		&[ugoira]
			@apply text-purple-600

	progress
		@apply absolute w-full h-6 left-0 top-0 opacity-90

		&::-webkit-progress-bar
			background-color: var(--colorBackground)
		&::-webkit-progress-value
			background-color: var(--colorOkay)

	p-state
		@apply relative inblock float-left text-xs py-1 px-1 elli select-none opacity-70
		max-width: 50%
		color: var(--colorText)
		background-color: var(--colorBackground)

		&[right]
			@apply float-right
</style>