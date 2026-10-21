<script lang="ts">
	import { posStore } from '$lib/stores/pos.svelte';
	import { formatCLP } from '$lib/utils/format';
	import { ClipboardList, BarChart3, Volume2, VolumeX, Pin } from 'lucide-svelte';
</script>

<header class="sticky top-0 z-30 border-b-2 border-slate-800 bg-slate-950/95 backdrop-blur-md">
	<div class="mx-auto flex max-w-7xl flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
		<!-- Identidad del Local + Indicador de Clavo -->
		<div class="flex items-center justify-between gap-3">
			<div class="flex items-center gap-2.5">
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-2xl shadow-md shadow-amber-500/20"
					aria-hidden="true"
				>
					🥟
				</div>
				<div>
					<div class="flex items-center gap-2">
						<h1 class="text-base font-black uppercase tracking-tight text-white sm:text-lg">
							Empanadas La Vega
						</h1>
						<span
							class="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-extrabold text-emerald-300 ring-1 ring-emerald-500/40"
						>
							<Pin class="h-3 w-3" />
							#{posStore.nextTicketNumber.toString().padStart(3, '0')}
						</span>
					</div>
					<p class="text-xs font-semibold text-slate-400">
						Block de Notas Inteligente • Punto de Venta Rápido
					</p>
				</div>
			</div>

			<!-- Botón Sonido Táctil (visible en móvil a la derecha del título) -->
			<button
				type="button"
				onclick={() => (posStore.soundEnabled = !posStore.soundEnabled)}
				class="flex h-11 items-center gap-1.5 rounded-xl border-2 px-3 text-xs font-bold transition sm:hidden {posStore.soundEnabled
					? 'border-amber-400/50 bg-amber-400/10 text-amber-300'
					: 'border-slate-700 bg-slate-900 text-slate-400'}"
				title={posStore.soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
			>
				{#if posStore.soundEnabled}
					<Volume2 class="h-4 w-4" />
					<span>Sonido</span>
				{:else}
					<VolumeX class="h-4 w-4" />
					<span>Mudo</span>
				{/if}
			</button>
		</div>

		<!-- Pestañas Gigantes de Navegación (Vista 1 vs Vista 2) -->
		<div class=" flex items-center gap-2">
			<nav
				class="grid flex-1 grid-cols-2 gap-2 rounded-2xl bg-slate-900 p-1.5 ring-1 ring-slate-800 sm:flex-initial"
				aria-label="Vistas principales"
			>
				<!-- Pestaña 1: Block de Notas (Caja) -->
				<button
					type="button"
					onclick={() => (posStore.activeTab = 'pos')}
					class="relative flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl px-4 py-2 text-sm font-black uppercase tracking-wide transition-all sm:min-w-[210px] sm:text-base {posStore.activeTab ===
					'pos'
						? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25'
						: 'bg-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white'}"
				>
					<ClipboardList class="h-5 w-5 shrink-0 stroke-[2.5]" />
					<span>1. Block de Caja</span>
					{#if posStore.currentTotalUnits > 0}
						<span
							class="ml-0.5 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-xs font-black tabular-nums {posStore.activeTab ===
							'pos'
								? 'bg-slate-950 text-amber-400'
								: 'bg-amber-400 text-slate-950'}"
						>
							{posStore.currentTotalUnits}
						</span>
					{/if}
				</button>

				<!-- Pestaña 2: Cierre de Caja y Métricas -->
				<button
					type="button"
					onclick={() => (posStore.activeTab = 'dashboard')}
					class="relative flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl px-4 py-2 text-sm font-black uppercase tracking-wide transition-all sm:min-w-[240px] sm:text-base {posStore.activeTab ===
					'dashboard'
						? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/25'
						: 'bg-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white'}"
				>
					<BarChart3 class="h-5 w-5 shrink-0 stroke-[2.5]" />
					<div class="flex flex-col items-start leading-none">
						<span>2. Cierre de Caja</span>
						<span
							class="mt-0.5 font-mono text-[11px] font-bold tabular-nums {posStore.activeTab ===
							'dashboard'
								? 'text-slate-900'
								: 'text-emerald-400'}"
						>
							Hoy: {formatCLP(posStore.metrics.todayTotal)} ({posStore.metrics.todayTicketsCount})
						</span>
					</div>
				</button>
			</nav>

			<!-- Botón Sonido Táctil (Desktop / Tablet) -->
			<button
				type="button"
				onclick={() => (posStore.soundEnabled = !posStore.soundEnabled)}
				class="hidden h-[56px] items-center gap-2 rounded-2xl border-2 px-3.5 text-xs font-extrabold uppercase tracking-wider transition sm:flex {posStore.soundEnabled
					? 'border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20'
					: 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'}"
				title={posStore.soundEnabled ? 'Desactivar sonido al tocar' : 'Activar sonido al tocar'}
			>
				{#if posStore.soundEnabled}
					<Volume2 class="h-5 w-5" />
					<span class="hidden lg:inline">Audio ON</span>
				{:else}
					<VolumeX class="h-5 w-5" />
					<span class="hidden lg:inline">Mudo</span>
				{/if}
			</button>
		</div>
	</div>
</header>
