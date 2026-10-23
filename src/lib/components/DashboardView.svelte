<script lang="ts">
	import { posStore } from '$lib/stores/pos.svelte';
	import type { ProductColorKey } from '$lib/types/pos';
	import { formatCLP, formatFullDateES, formatTimeHHMM } from '$lib/utils/format';
	import {
		Trophy,
		Flame,
		TrendingUp,
		TrendingDown,
		Receipt,
		Clock,
		CalendarRange,
		Copy,
		Check,
		RefreshCw,
		Trash2,
		Pin,
		Utensils,
		CupSoda,
		ArrowUpRight
	} from 'lucide-svelte';

	let rankingPeriod = $state<'today' | 'week'>('today');
	let showAllProductsInRanking = $state<boolean>(false);
	let copiedSummary = $state<boolean>(false);

	const metrics = $derived(posStore.metrics);
	const fullRanking = $derived(
		rankingPeriod === 'today' ? metrics.productRankingToday : metrics.productRankingWeek
	);
	const activeRanking = $derived.by(() => {
		if (showAllProductsInRanking) return fullRanking;
		const withSales = fullRanking.filter((item) => item.units > 0);
		return withSales.length > 0 ? withSales.slice(0, 8) : fullRanking.slice(0, 8);
	});
	const activeStarProduct = $derived(
		rankingPeriod === 'today' ? metrics.starProductToday : metrics.starProductWeek
	);

	const barColorClasses: Record<ProductColorKey, string> = {
		amber: 'bg-amber-400',
		rose: 'bg-rose-500',
		yellow: 'bg-yellow-300',
		indigo: 'bg-indigo-500',
		orange: 'bg-orange-500',
		cyan: 'bg-cyan-400',
		emerald: 'bg-emerald-400'
	};

	const maxDailyComparison = $derived.by(() => {
		const values = metrics.weeklyComparison.dailyBreakdown.flatMap((d) => [
			d.currentWeekRevenue,
			d.previousWeekRevenue
		]);
		return Math.max(...values, 1);
	});

	async function copyDailySummary() {
		const star = metrics.starProductToday
			? `${metrics.starProductToday.name} (${metrics.starProductToday.units} un.)`
			: 'Sin ventas';
		const text = [
			`🥟 *CIERRE DE CAJA — EMPANADAS Y AREPAS LA VEGA*`,
			`📅 ${formatFullDateES(new Date())}`,
			`──────────────────────`,
			`💰 *TOTAL CAJA HOY:* ${formatCLP(metrics.todayTotal)} CLP`,
			`📌 *Tickets Guardados:* ${metrics.todayTicketsCount} pedidos`,
			`🥟 *Empanadas vendidas:* ${metrics.todayEmpanadasCount} un.`,
			`🫓 *Arepas vendidas:* ${metrics.todayArepasCount} un.`,
			`🥤 *Bebidas y Jugos:* ${metrics.todayBebidasCount} un.`,
			`🏆 *Producto Estrella:* ${star}`,
			`🔥 *Hora Pico:* ${metrics.peakHour ? `${metrics.peakHour.label} (${formatCLP(metrics.peakHour.revenue)} CLP)` : 'N/A'}`
		].join('\n');

		try {
			await navigator.clipboard.writeText(text);
			copiedSummary = true;
			setTimeout(() => {
				copiedSummary = false;
			}, 3000);
		} catch {
			// Fallback silencioso
		}
	}
</script>

<main class="mx-auto max-w-7xl space-y-5 px-3 py-4 sm:px-5 sm:py-6">
	<!-- Encabezado de Fecha + Acciones Rápidas de la Dueña -->
	<div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
		<div>
			<span class="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
				Resumen Automático • Cero Cuentas Manuales
			</span>
			<h2 class="text-2xl font-black tracking-tight text-white sm:text-3xl">
				{formatFullDateES(new Date())}
			</h2>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<button
				type="button"
				onclick={copyDailySummary}
				class="flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-emerald-400/50 bg-emerald-500/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/25 active:scale-95 sm:text-sm"
			>
				{#if copiedSummary}
					<Check class="h-4 w-4 stroke-[3]" />
					<span>¡Resumen Copiado!</span>
				{:else}
					<Copy class="h-4 w-4 stroke-[2.5]" />
					<span>Copiar Cierre (WhatsApp)</span>
				{/if}
			</button>

			<button
				type="button"
				onclick={() => posStore.resetDemoData()}
				class="flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 active:scale-95"
				title="Recargar datos de prueba de La Vega"
			>
				<RefreshCw class="h-4 w-4" />
				<span>Restaurar Datos Demo</span>
			</button>
		</div>
	</div>

	<!-- ==================================================================== -->
	<!-- 1. TARJETA PRINCIPAL: "CIERRE DE CAJA" (Monto Acumulado y Tickets)   -->
	<!-- ==================================================================== -->
	<section
		class="relative overflow-hidden rounded-3xl border-2 border-emerald-400/70 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 p-5 shadow-2xl sm:p-7"
		aria-label="Tarjeta principal de Cierre de Caja"
	>
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
			<!-- Total en Caja Gigante -->
			<div class="lg:col-span-5">
				<div
					class="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/40"
				>
					<Receipt class="h-4 w-4" />
					<span>Cierre de Caja del Día (En Vivo)</span>
				</div>

				<div
					class="mt-3 font-mono text-4xl font-black tracking-tight text-white tabular-nums sm:text-5xl"
				>
					{formatCLP(metrics.todayTotal)} <span class="text-xl font-extrabold text-emerald-400">CLP</span>
				</div>

				<p class="mt-2 text-sm font-bold text-slate-300">
					Suma exacta de todos los tickets guardados hoy en el local.
				</p>
			</div>

			<!-- Contadores Clave del Día (Tickets, Empanadas, Arepas, Bebidas, Promedio) -->
			<div class="grid grid-cols-2 gap-2.5 sm:grid-cols-5 lg:col-span-7">
				<!-- Total Tickets / Pedidos -->
				<div class="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3">
					<div class="flex items-center gap-1.5 text-xs font-extrabold uppercase text-amber-400">
						<Pin class="h-4 w-4" />
						<span>Tickets</span>
					</div>
					<div class="mt-1.5 font-mono text-2xl font-black text-white tabular-nums sm:text-3xl">
						{metrics.todayTicketsCount}
					</div>
					<div class="mt-0.5 text-[11px] font-semibold text-slate-400">Pedidos hoy</div>
				</div>

				<!-- Total Empanadas -->
				<div class="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3">
					<div class="flex items-center gap-1.5 text-xs font-extrabold uppercase text-rose-400">
						<Utensils class="h-4 w-4" />
						<span>Empanadas</span>
					</div>
					<div class="mt-1.5 font-mono text-2xl font-black text-white tabular-nums sm:text-3xl">
						{metrics.todayEmpanadasCount}
					</div>
					<div class="mt-0.5 text-[11px] font-semibold text-slate-400">Unidades</div>
				</div>

				<!-- Total Arepas -->
				<div class="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3">
					<div class="flex items-center gap-1.5 text-xs font-extrabold uppercase text-orange-400">
						<span>🫓</span>
						<span>Arepas</span>
					</div>
					<div class="mt-1.5 font-mono text-2xl font-black text-white tabular-nums sm:text-3xl">
						{metrics.todayArepasCount}
					</div>
					<div class="mt-0.5 text-[11px] font-semibold text-slate-400">Unidades</div>
				</div>

				<!-- Total Bebidas -->
				<div class="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3">
					<div class="flex items-center gap-1.5 text-xs font-extrabold uppercase text-cyan-400">
						<CupSoda class="h-4 w-4" />
						<span>Bebidas</span>
					</div>
					<div class="mt-1.5 font-mono text-2xl font-black text-white tabular-nums sm:text-3xl">
						{metrics.todayBebidasCount}
					</div>
					<div class="mt-0.5 text-[11px] font-semibold text-slate-400">Refrescos/Jugos</div>
				</div>

				<!-- Ticket Promedio -->
				<div class="col-span-2 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3 sm:col-span-1">
					<div class="flex items-center gap-1.5 text-xs font-extrabold uppercase text-emerald-400">
						<ArrowUpRight class="h-4 w-4" />
						<span>Promedio</span>
					</div>
					<div class="mt-1.5 font-mono text-xl font-black text-white tabular-nums sm:text-2xl">
						{formatCLP(metrics.todayAverageTicket)}
					</div>
					<div class="mt-0.5 text-[11px] font-semibold text-slate-400">Por pedido</div>
				</div>
			</div>
		</div>
	</section>

	<!-- GRILLA DE MÉTRICAS PRINCIPALES (Métrica 1 y Métrica 2) -->
	<div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
		<!-- ================================================================== -->
		<!-- 2. MÉTRICA 1: PRODUCTO ESTRELLA Y RANKING DE VENTAS                -->
		<!-- ================================================================== -->
		<section
			class="flex flex-col justify-between rounded-3xl border-2 border-slate-800 bg-slate-900 p-5 lg:col-span-6"
			aria-label="Métrica 1: Producto Estrella"
		>
			<div>
				<!-- Cabecera + Selector Hoy / Esta Semana -->
				<div class="flex flex-wrap items-center justify-between gap-2">
					<div class="flex items-center gap-2.5">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-slate-950"
						>
							<Trophy class="h-6 w-6 stroke-[2.5]" />
						</div>
						<div>
							<h3 class="text-lg font-black uppercase tracking-tight text-white">
								Producto Estrella y Ranking
							</h3>
							<p class="text-xs font-bold text-slate-400">
								¿Qué es lo que más piden los clientes del menú?
							</p>
						</div>
					</div>

					<div class="inline-flex rounded-xl bg-slate-950 p-1 ring-1 ring-slate-800">
						<button
							type="button"
							onclick={() => (rankingPeriod = 'today')}
							class="rounded-lg px-3 py-1.5 text-xs font-black uppercase transition {rankingPeriod ===
							'today'
								? 'bg-amber-400 text-slate-950'
								: 'text-slate-400 hover:text-white'}"
						>
							Hoy
						</button>
						<button
							type="button"
							onclick={() => (rankingPeriod = 'week')}
							class="rounded-lg px-3 py-1.5 text-xs font-black uppercase transition {rankingPeriod ===
							'week'
								? 'bg-amber-400 text-slate-950'
								: 'text-slate-400 hover:text-white'}"
						>
							Esta Semana
						</button>
					</div>
				</div>

				<!-- Tarjeta Destacada del #1 -->
				{#if activeStarProduct}
					<div
						class="mt-4 flex items-center justify-between gap-4 rounded-2xl border-2 border-amber-400/60 bg-amber-400/10 p-4"
					>
						<div class="flex items-center gap-3.5">
							<div
								class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-3xl shadow-lg"
							>
								{activeStarProduct.emoji}
							</div>
							<div>
								<span
									class="inline-block rounded-md bg-amber-400 px-2 py-0.5 text-[11px] font-black uppercase text-slate-950"
								>
									#1 Más Vendido ({rankingPeriod === 'today' ? 'Hoy' : 'Semana'})
								</span>
								<h4 class="mt-1 text-2xl font-black text-white">
									{activeStarProduct.name}
								</h4>
								<p class="text-xs font-bold text-amber-200">
									Representa el {activeStarProduct.sharePercent}% de las unidades vendidas
								</p>
							</div>
						</div>

						<div class="text-right">
							<div class="font-mono text-3xl font-black text-amber-300 tabular-nums">
								{activeStarProduct.units} <span class="text-base font-extrabold">un.</span>
							</div>
							<div class="font-mono text-sm font-bold text-slate-300 tabular-nums">
								{formatCLP(activeStarProduct.revenue)} CLP
							</div>
						</div>
					</div>
				{/if}

				<!-- Ranking Visual con Barras de Progreso -->
				<div class="custom-scrollbar-dark mt-4 max-h-[380px] space-y-2.5 overflow-y-auto pr-1">
					{#each activeRanking as item, index (item.productId)}
						{@const maxUnits = Math.max(fullRanking[0]?.units ?? 1, 1)}
						{@const barWidth = Math.max(6, Math.round((item.units / maxUnits) * 100))}
						<div class="rounded-xl bg-slate-950/70 p-2.5 ring-1 ring-slate-800/90">
							<div class="flex items-center justify-between gap-2 text-sm">
								<div class="flex items-center gap-2 font-black text-white">
									<span
										class="inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-black {index ===
										0
											? 'bg-amber-400 text-slate-950'
											: 'bg-slate-800 text-slate-300'}"
									>
										{index + 1}
									</span>
									<span>{item.emoji}</span>
									<span>{item.name}</span>
								</div>

								<div class="flex items-baseline gap-3 font-mono">
									<span class="text-sm font-black text-white tabular-nums">
										{item.units} un.
									</span>
									<span class="text-xs font-bold text-slate-400 tabular-nums">
										{formatCLP(item.revenue)}
									</span>
								</div>
							</div>

							<!-- Barra de progreso de alto contraste -->
							<div class="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
								<div
									class="h-full rounded-full transition-all duration-300 {barColorClasses[item.colorKey]}"
									style="width: {item.units > 0 ? barWidth : 0}%"
								></div>
							</div>
						</div>
					{/each}
				</div>

				<div class="mt-3 flex justify-end">
					<button
						type="button"
						onclick={() => (showAllProductsInRanking = !showAllProductsInRanking)}
						class="text-xs font-black uppercase tracking-wider text-amber-400 hover:text-amber-300"
					>
						{showAllProductsInRanking
							? 'Mostrar solo Top Más Vendidos'
							: `Ver catálogo completo (${fullRanking.length} productos)`}
					</button>
				</div>
			</div>
		</section>

		<!-- ================================================================== -->
		<!-- 3. MÉTRICA 2: FLUJO POR HORA (HORAS PICO EN LA VEGA)               -->
		<!-- ================================================================== -->
		<section
			class="flex flex-col justify-between rounded-3xl border-2 border-slate-800 bg-slate-900 p-5 lg:col-span-6"
			aria-label="Métrica 2: Flujo por Hora"
		>
			<div>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<div class="flex items-center gap-2.5">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-slate-950"
						>
							<Clock class="h-6 w-6 stroke-[2.5]" />
						</div>
						<div>
							<h3 class="text-lg font-black uppercase tracking-tight text-white">
								Flujo por Hora (Horas Pico)
							</h3>
							<p class="text-xs font-bold text-slate-400">
								Ritmo de ventas hoy en La Vega (07:00 a 17:00 hrs)
							</p>
						</div>
					</div>

					{#if metrics.peakHour}
						<div
							class="inline-flex items-center gap-1.5 rounded-xl border border-orange-400/50 bg-orange-500/20 px-3 py-1.5 text-xs font-black uppercase text-orange-300"
						>
							<Flame class="h-4 w-4 text-orange-400" />
							<span>Hora Pico: {metrics.peakHour.label} ({metrics.peakHour.tickets} pedidos)</span>
						</div>
					{/if}
				</div>

				<!-- Gráfico de Barras Verticales de Alto Contraste -->
				<div class="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
					<div class="grid h-56 grid-cols-11 items-end gap-1.5 pt-6 sm:gap-2.5">
						{#each metrics.hourlyFlow as slot (slot.hour)}
							<div class="group relative flex h-full flex-col items-center justify-end">
								{#if slot.tickets > 0}
									<span
										class="mb-1 font-mono text-[11px] font-black tabular-nums {slot.isPeak
											? 'text-amber-300'
											: 'text-slate-300'}"
									>
										{slot.tickets}p
									</span>
								{/if}

								<div class="flex w-full flex-1 items-end justify-center">
									<div
										class="w-full rounded-t-xl transition-all duration-300 {slot.isPeak
											? 'bg-gradient-to-t from-orange-500 to-amber-300 ring-2 ring-amber-200'
											: slot.tickets > 0
												? 'bg-emerald-500/85 hover:bg-emerald-400'
												: 'bg-slate-800/70'}"
										style="height: {slot.tickets > 0 ? Math.max(14, slot.intensityPercent) : 6}%"
										title="{slot.label}: {slot.tickets} pedidos — {formatCLP(slot.revenue)} CLP"
									></div>
								</div>

								<span
									class="mt-2 font-mono text-xs font-black {slot.isPeak
										? 'text-amber-300'
										: 'text-slate-400'}"
								>
									{slot.shortLabel}
								</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Desglose rápido de las 3 horas más fuertes del día -->
				<div class="mt-4">
					<h4 class="mb-2.5 text-xs font-black uppercase tracking-wider text-slate-400">
						Detalle de Franjas con Mayor Movimiento Hoy
					</h4>
					<div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
						{#each metrics.hourlyFlow
							.slice()
							.sort((a, b) => b.revenue - a.revenue)
							.slice(0, 3) as topSlot, idx}
							<div
								class="flex items-center justify-between rounded-2xl border p-3 {idx === 0
									? 'border-orange-400/60 bg-orange-500/10'
									: 'border-slate-800 bg-slate-950/70'}"
							>
								<div>
									<div class="flex items-center gap-1.5">
										{#if idx === 0}
											<Flame class="h-4 w-4 text-orange-400" />
										{/if}
										<span class="font-mono text-sm font-black text-white">
											{topSlot.label} hrs
										</span>
									</div>
									<div class="mt-0.5 text-xs font-bold text-slate-400">
										{topSlot.tickets} tickets • {topSlot.empanadasUnits} comidas
									</div>
								</div>
								<div class="font-mono text-base font-black text-emerald-400 tabular-nums">
									{formatCLP(topSlot.revenue)}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	</div>

	<!-- ==================================================================== -->
	<!-- 4. MÉTRICA 3: COMPARATIVA SEMANAL (Esta Semana vs Semana Anterior)   -->
	<!-- ==================================================================== -->
	<section
		class="rounded-3xl border-2 border-slate-800 bg-slate-900 p-5 sm:p-6"
		aria-label="Métrica 3: Comparativa Semanal"
	>
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
			<div class="space-y-4 lg:col-span-5">
				<div class="flex items-center gap-2.5">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
						<CalendarRange class="h-6 w-6 stroke-[2.5]" />
					</div>
					<div>
						<h3 class="text-lg font-black uppercase tracking-tight text-white">
							Comparativa Semanal
						</h3>
						<p class="text-xs font-bold text-slate-400">
							Esta semana vs. Semana anterior completa
						</p>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="rounded-2xl border-2 border-emerald-400/50 bg-slate-950 p-3.5">
						<span class="text-xs font-extrabold uppercase text-emerald-400">Esta Semana</span>
						<div class="mt-1 font-mono text-2xl font-black text-white tabular-nums sm:text-3xl">
							{formatCLP(metrics.weeklyComparison.currentWeekTotal)}
						</div>
						<div class="mt-0.5 text-xs font-bold text-slate-400">
							{metrics.weeklyComparison.currentWeekTickets} pedidos
						</div>
					</div>

					<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
						<span class="text-xs font-extrabold uppercase text-slate-400">Semana Pasada</span>
						<div class="mt-1 font-mono text-2xl font-black text-slate-300 tabular-nums sm:text-3xl">
							{formatCLP(metrics.weeklyComparison.previousWeekTotal)}
						</div>
						<div class="mt-0.5 text-xs font-bold text-slate-500">
							{metrics.weeklyComparison.previousWeekTickets} pedidos
						</div>
					</div>
				</div>

				<div
					class="flex items-center justify-between rounded-2xl border-2 p-4 {metrics.weeklyComparison
						.trend === 'up'
						? 'border-emerald-400/70 bg-emerald-500/15 text-emerald-300'
						: metrics.weeklyComparison.trend === 'down'
							? 'border-rose-400/70 bg-rose-500/15 text-rose-300'
							: 'border-slate-700 bg-slate-800 text-slate-200'}"
				>
					<div class="flex items-center gap-3">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl {metrics
								.weeklyComparison.trend === 'up'
								? 'bg-emerald-400 text-slate-950'
								: 'bg-rose-500 text-white'}"
						>
							{#if metrics.weeklyComparison.trend === 'up'}
								<TrendingUp class="h-7 w-7 stroke-[2.75]" />
							{:else}
								<TrendingDown class="h-7 w-7 stroke-[2.75]" />
							{/if}
						</div>
						<div>
							<div class="text-base font-black uppercase">
								{metrics.weeklyComparison.trend === 'up'
									? '¡Vas Arriba esta Semana!'
									: 'Por debajo de la semana pasada'}
							</div>
							<div class="text-xs font-bold opacity-90">
								Diferencia: {metrics.weeklyComparison.deltaAmount >= 0 ? '+' : ''}{formatCLP(
									metrics.weeklyComparison.deltaAmount
								)} CLP
							</div>
						</div>
					</div>

					<div class="font-mono text-3xl font-black tabular-nums">
						{metrics.weeklyComparison.deltaPercent >= 0 ? '+' : ''}{metrics.weeklyComparison
							.deltaPercent}%
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-800 bg-slate-950 p-4 lg:col-span-7">
				<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
					<span class="text-xs font-black uppercase tracking-wider text-slate-300">
						Rendimiento Diario (Lunes a Domingo)
					</span>
					<div class="flex items-center gap-4 text-xs font-bold">
						<span class="flex items-center gap-1.5 text-emerald-400">
							<span class="h-3 w-3 rounded-sm bg-emerald-400"></span>
							Esta Semana
						</span>
						<span class="flex items-center gap-1.5 text-slate-400">
							<span class="h-3 w-3 rounded-sm bg-slate-600"></span>
							Semana Anterior
						</span>
					</div>
				</div>

				<div class="grid grid-cols-7 gap-2 pt-2 sm:gap-3">
					{#each metrics.weeklyComparison.dailyBreakdown as day (day.dayName)}
						{@const currHeight = Math.round((day.currentWeekRevenue / maxDailyComparison) * 100)}
						{@const prevHeight = Math.round((day.previousWeekRevenue / maxDailyComparison) * 100)}
						<div
							class="flex flex-col items-center rounded-xl p-2 {day.isToday
								? 'bg-emerald-500/10 ring-1 ring-emerald-400/50'
								: 'bg-slate-900/60'}"
						>
							<div class="flex h-36 w-full items-end justify-center gap-1.5">
								<div
									class="w-3.5 rounded-t-md bg-slate-600 transition-all sm:w-4"
									style="height: {Math.max(8, prevHeight)}%"
									title="{day.fullDayName} semana pasada: {formatCLP(day.previousWeekRevenue)} CLP"
								></div>
								<div
									class="w-3.5 rounded-t-md transition-all sm:w-4 {day.isToday
										? 'bg-amber-400 ring-1 ring-white'
										: day.currentWeekRevenue > 0
											? 'bg-emerald-400'
											: 'bg-slate-800'}"
									style="height: {day.currentWeekRevenue > 0 ? Math.max(10, currHeight) : 4}%"
									title="{day.fullDayName} esta semana: {formatCLP(day.currentWeekRevenue)} CLP"
								></div>
							</div>

							<span
								class="mt-2 text-xs font-black uppercase {day.isToday
									? 'text-amber-300'
									: 'text-slate-300'}"
							>
								{day.dayName}
							</span>
							<span class="font-mono text-[10px] font-bold text-slate-400 tabular-nums">
								{day.currentWeekRevenue > 0
									? `$${Math.round(day.currentWeekRevenue / 1000)}k`
									: '—'}
							</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ==================================================================== -->
	<!-- 5. EL "CLAVO DIGITAL": HISTORIAL DE TICKETS GUARDADOS HOY            -->
	<!-- ==================================================================== -->
	<section
		class="rounded-3xl border-2 border-slate-800 bg-slate-900 p-5"
		aria-label="El Clavo Digital - Últimos tickets guardados hoy"
	>
		<div class="mb-4 flex items-center justify-between">
			<div class="flex items-center gap-2.5">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300"
				>
					<Pin class="h-5 w-5 stroke-[2.5]" />
				</div>
				<div>
					<h3 class="text-lg font-black uppercase tracking-tight text-white">
						El Clavo Digital (Tickets de Hoy)
					</h3>
					<p class="text-xs font-bold text-slate-400">
						Cada pedido cobrado queda guardado con su hora exacta. Puedes anular si hubo error.
					</p>
				</div>
			</div>
			<span class="rounded-xl bg-slate-950 px-3 py-1.5 font-mono text-xs font-black text-amber-300">
				Total: {posStore.todaySalesList.length} tickets
			</span>
		</div>

		{#if posStore.todaySalesList.length === 0}
			<div class="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
				Aún no hay tickets guardados hoy. Ve a "1. Block de Caja" para anotar la primera venta.
			</div>
		{:else}
			<div class="custom-scrollbar-dark max-h-[340px] overflow-y-auto pr-1">
				<div class="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
					{#each posStore.todaySalesList.slice(0, 18) as sale (sale.id)}
						<div
							class="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3.5 transition hover:border-slate-700"
						>
							<div>
								<div
									class="flex items-center justify-between border-b border-dashed border-slate-800 pb-2"
								>
									<div class="flex items-center gap-2">
										<span
											class="rounded-lg bg-amber-400/20 px-2 py-0.5 font-mono text-xs font-black text-amber-300"
										>
											#{sale.ticketNumber.toString().padStart(3, '0')}
										</span>
										<span class="font-mono text-xs font-bold text-slate-400">
											{formatTimeHHMM(sale.createdAt)} hrs
										</span>
									</div>
									<span class="font-mono text-lg font-black text-emerald-400 tabular-nums">
										{formatCLP(sale.total)} CLP
									</span>
								</div>

								<p class="mt-2 text-xs font-bold leading-relaxed text-slate-200">
									{sale.items.map((i) => `${i.quantity}x ${i.shortName}`).join(' + ')}
								</p>
							</div>

							<div
								class="mt-3 flex items-center justify-between pt-1 text-[11px] font-bold text-slate-500"
							>
								<span>
									{#if (sale.changeGiven ?? 0) > 0}
										Pagó {formatCLP(sale.cashReceived ?? sale.total)} • Vuelto {formatCLP(
											sale.changeGiven ?? 0
										)}
									{:else}
										Pago exacto
									{/if}
								</span>
								<button
									type="button"
									onclick={() => posStore.deleteSaleById(sale.id)}
									class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-rose-400 transition hover:bg-rose-500/15 hover:text-rose-300"
									title="Anular este ticket"
								>
									<Trash2 class="h-3.5 w-3.5" />
									<span>Anular</span>
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>
</main>
