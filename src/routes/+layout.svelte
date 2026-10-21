<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { posStore } from '$lib/stores/pos.svelte';

	let { children } = $props();

	onMount(() => {
		posStore.initClient();
	});
</script>

<div class="min-h-dvh bg-slate-950 text-white">
	{@render children()}
</div>
