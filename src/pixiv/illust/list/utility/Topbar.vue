<template>
	<comp-topbar>
		<slot />
	</comp-topbar>
</template>

<script setup>

</script>

<style lang="sass">
comp-topbar
	@apply absolute block w-full h-12 bg-blue-200 z-20 shadow-mdd

	>*
		@apply mt-1 ml-2 mr-0

		&[right]
			@apply float-right ml-0 mr-2

	p-part
		@apply relative inblock
		height: calc(var(--widthSidebar) - 1rem)
		line-height: calc(var(--widthSidebar) - 1rem)

		&[header]
				@apply bg-cover rounded-md shadow-md
				width: calc( var(--widthSidebar) - 1rem)

		&[panel]
			@apply rounded-md text-center text-xl shadow-mdd cursor-pointer outline-none
			width: calc(var(--widthSidebar) - 1rem)
			line-height: calc(var(--widthSidebar) - 1rem)
			background-color: var(--cTextMain)
			color: var(--cTextBack)

			&:focus-within
				@apply ring-2 ring-yellow-500

			&[input]>input
					@apply rounded-md w-full text-center outline-none z-20 bg-transparent

			&[input]>select
					@apply rounded-md w-full text-center outline-none z-20 bg-transparent

		svg[corner]
			@apply absolute opacity-25 z-10 text-xs top-0.5 left-0.5

		&[_page]
			@apply w-24

		&[_keyword]
			@apply w-48
</style>
