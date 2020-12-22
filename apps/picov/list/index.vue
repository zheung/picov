<template>
	<div>
		<!-- <div class="Topbar">
			<Fa class="Icon" icon="angle-left" @click="atTurnPage(-1)" />
			<input v-model="params.page" type="number" class="inline Page" min="1" @keyup.enter="atTurnPage(0)" />
			<Fa class="Icon" icon="angle-right" @click="atTurnPage(1)" />
		</div> -->
		<Thumb
			v-for="(illust, illustIndex) of B.lists[B.typeList]" :key="`thumb-${illustIndex}`"
			class="Thumb inline"
			:illust="illust" :index="illustIndex" @click="atSave(illust)"
		/>
	</div>
</template>

<script>
	import B from 'Bus';
	import Thumb from '../image/Thumb';

	export default {
		components: { Thumb },
		data() {
			return {
				params: {
					page: 1
				}
			};
		},
		async mounted() {
			B.typeList = 'follow';

			this.atQuery();
		},

		methods: {
			async atQuery() {
				this.$set(B.lists, 'follow', await A.conn('list/follow', this.params));
			},
			atTurnPage(offset) {
				this.params.page =
					~~this.params.page + ~~offset < 0 ?
						1 :
						~~this.params.page + ~~offset;

				this.atQuery();
			},
			atSave() {

			}
		}
	};
</script>

<style lang="sass" scoped>
.View
	font-size: $fs
	display: flex
	flex-flow: row wrap
	align-content: flex-start

.Topbar
	width: 100%
	height: 32px
	line-height: 32px

	>.Icon
		width: 32px
		height: calc(100% - 6px)
		padding: 4px 0px
		cursor: pointer

		&:hover
			color: var(--cStress)

	>.Page
		width: 32px
		height: 100%
		border: 0px
		color: var(--cLight)
		font-size: 16px
		text-align: center
		background: transparent
		outline: none

		&::-webkit-outer-spin-button, &::-webkit-inner-spin-button
			-webkit-appearance: none

.Thumb
	flex: 0 0 20%
	height: 33.3vh
</style>