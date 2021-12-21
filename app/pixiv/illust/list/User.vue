<template>
	<module class="overflow-x-hidden overflow-y-hidden">
		<Topbar>
			<p-part v-if="!I.illustsNow.length"><Fas icon="compass" :spin="true" /> 加载作者（{{I.params.uid}}）</p-part>
			<p-part v-if="I.illustsNow.length" header :style="{ backgroundImage: `url(${now.header})` }" />
			<p-part v-if="I.illustsNow.length" :title="I.params.uid">作者（{{I.name}}）{{I.isFollowed ? '已关注' : '未关注'}}</p-part>


			<p-part ref="nextPager" v-tip.bottom="'下一页'" panel right tabindex="7" @click="nextPage()" @keydown.enter.space="nextPage()">
				<Fas icon="angle-double-right" />
			</p-part>
			<p-part v-tip.bottom="'当前页'" panel right input _page>
				<Fas icon="book-open" corner />
				<input v-model="I.paramsPre.page" tabindex="6" type="text" @keydown.enter="atFetch" />
			</p-part>
			<p-part v-tip.bottom="'上一页'" panel right tabindex="5" @click="prevPage()" @keydown.enter.space="prevPage()">
				<Fas icon="angle-double-left" />
			</p-part>
			<p-part v-tip.bottom="'全部下载'" panel right @click="IA.saveAll(I.illustsNow)"><Fas icon="download" /></p-part>
			<p-part v-tip.bottom="'作者主页'" panel right @click="atOpen"><Fas icon="house-user" /></p-part>
			<p-part v-if="I.illustsNow.length" right><Fas icon="paint-brush" /> {{counter}}</p-part>
		</Topbar>

		<p-illusts>
			<Illust v-for="(illust, index) of I.illustsNow" :key="`illust-${illust.iid}`"
				:illust="illust" :z-index="I.illustsNow.length - index"
			/>
		</p-illusts>
	</module>
</template>

<script setup>
	import { computed, inject, onActivated, onBeforeMount, ref, watch } from 'vue';

	import { Tab } from '../admin/TabAdmin.js';

	import Illust from './utility/Illust.vue';
	import Topbar from './utility/Topbar.vue';


	const $get = inject('$get');

	const who = inject('who');


	/** @type {import('vue').Ref<import('../admin/IllustAdmin.js').default>} */
	const IA = inject('IA');
	/** @type {import('../admin/TabAdmin.js').default} */
	const TA = inject('TA');

	const now = ref(new Tab());
	const I = computed(() => now.value.info);


	const counter = computed(() => IA.value.countText(I.value.illustsNow));


	const atFetch = async step_ => {
		const tabNow = now.value;
		const info = tabNow.info;


		const step = ~~step_;
		let { uid, page } = info.paramsPre;

		if(step > 0 || step < 0 && page + step > 0) { page = (info.paramsPre.page += step); }


		const iidsNow = info.alls.slice((page - 1) * 15, page * 15);

		info.illustsNow = (await $get('pixiv/illust/list/illust', { who: who.value, uid, iids: iidsNow }))?.reverse() ?? [];

		IA.value.watch(info.illustsNow);

		tabNow.title = `【作者】${info.name}（第${page}页）`;
		info.params.uid = uid;
		info.params.page = page;
	};


	const atChangeTab = async () => {
		const tab = TA.now.value;
		const params = TA.params.value;

		if(tab.typeList != 'user') { return; }
		now.value = tab;

		const [uid, sInitTab] = params;

		if(sInitTab === TA.sInitTab) {
			tab.info.params = { uid, page: 1 };
			tab.info.paramsPre = { uid, page: 1 };
			tab.info.header = {};


			const { illusts, mangas, alls, name, isFollowed, header } = (await $get('pixiv/illust/list/user', { who: who.value, uid })) ?? [];

			tab.info.illusts = illusts;
			tab.info.mangas = mangas;
			tab.info.alls = alls;

			tab.info.name = name;
			tab.info.isFollowed = isFollowed;
			tab.info.header = header;

			tab.typeTab = 'header';
			tab.header = header.noProfile ? 'no_profile.png' : `api/pixiv/user/header?who=${who.value}&time=${tab.info.header.time}&token=${tab.info.header.token}&ext=${tab.info.header.ext}`;
			tab.title = `作者：${name}`;

			atFetch();
		}
	};

	watch(TA.now, atChangeTab);
	onBeforeMount(atChangeTab);


	const atOpen = () => window.open(`https://www.pixiv.net/users/${I.value.params.uid}/illustrations`);


	const nextPager = ref(null);
	onActivated(() => nextPager.value?.focus());
</script>

<style lang="sass" scoped>
p-illusts
	@apply block mt-12 z-10 w-full overflow-x-hidden overflow-y-scroll
	height: calc(100vh - 3rem)
</style>