<script lang="ts">
	import TopNav from '$lib/components/TopNav.svelte';
	import NotepadPosView from '$lib/components/NotepadPosView.svelte';
	import DashboardView from '$lib/components/DashboardView.svelte';
	import { posStore } from '$lib/stores/pos.svelte';
</script>

<svelte:head>
	<title>
		{posStore.activeTab === 'pos'
			? 'Block de Caja — Empanadas La Vega'
			: 'Cierre de Caja y Métricas — Empanadas La Vega'}
	</title>
</svelte:head>

<TopNav />

{#if posStore.activeTab === 'pos'}
	<NotepadPosView />
{:else}
	<DashboardView />
{/if}
