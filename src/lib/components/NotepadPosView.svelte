<script lang="ts">
	import { posStore } from '$lib/stores/pos.svelte';
	import type { ProductCategory, ProductColorKey } from '$lib/types/pos';
	import { formatCLP, formatTimeHHMM } from '$lib/utils/format';
	import {
		CheckCircle2,
		Minus,
		Plus,
		Trash2,
		RotateCcw,
		Banknote,
		Pin,
		Sparkles,
		Calculator,
		Star,
		Flame
	} from 'lucide-svelte';

	type BebidaFilter = 'all' | 'refresco' | 'jugo' | 'grande';

	// 1. Navegación por Pestañas Principales: abre por defecto en 'empanada'
	let activeCategory = $state<ProductCategory>('empanada');
	let bebidaSubFilter = $state<BebidaFilter>('all');

	// Subgrupos derivados de Empanadas
	const empanadasTradicionales = $derived(
		posStore.products.filter((p) => p.category === 'empanada' && p.subcategory === 'tradicional')
	);
	const empanadasEspeciales = $derived(
		posStore.products.filter((p) => p.category === 'empanada' && p.subcategory === 'especial')
	);

	// Subgrupo derivado de Arepas
	const arepasList = $derived(posStore.products.filter((p) => p.category === 'arepa'));

	// Subgrupos derivados de Bebidas
	const bebidasRefrescos = $derived(
		posStore.products.filter((p) => p.category === 'bebida' && p.subcategory === 'refresco')
	);
	const bebidasJugos = $derived(
		posStore.products.filter((p) => p.category === 'bebida' && p.subcategory === 'jugo')
	);
	const bebidasGrandes = $derived(
		posStore.products.filter((p) => p.category === 'bebida' && p.subcategory === 'grande')
	);

	// Contadores de unidades anotadas en el ticket actual por cada categoría principal
	const categoryUnitCounts = $derived.by<Record<ProductCategory, number>>(() => {
		const counts: Record<ProductCategory, number> = {
			empanada: 0,
			arepa: 0,
			bebida: 0
		};
		for (const item of posStore.orderItems) {
			counts[item.product.category] += item.quantity;
		}
		return counts;
	});

	// Estilos de alto contraste pensados para identificación cromática instantánea
	const colorStyles: Record<
		ProductColorKey,
		{
			cardBg: string;
			cardActive: string;
			badgeBg: string;
			pricePill: string;
			accentBar: string;
		}
	> = {
		amber: {
			cardBg:
				'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-amber-300 hover:from-amber-400 hover:to-amber-500',
			cardActive: 'ring-4 ring-white shadow-xl shadow-amber-500/30',
			badgeBg: 'bg-slate-950/90 text-amber-300',
			pricePill: 'bg-slate-950 text-amber-300',
			accentBar: 'bg-amber-500'
		},
		rose: {
			cardBg:
				'bg-gradient-to-br from-rose-600 to-red-700 text-white border-rose-300 hover:from-rose-500 hover:to-red-600',
			cardActive: 'ring-4 ring-white shadow-xl shadow-rose-600/35',
			badgeBg: 'bg-slate-950/90 text-rose-300',
			pricePill: 'bg-slate-950 text-rose-200',
			accentBar: 'bg-rose-600'
		},
		yellow: {
			cardBg:
				'bg-gradient-to-br from-yellow-300 to-amber-400 text-slate-950 border-yellow-100 hover:from-yellow-200 hover:to-amber-300',
			cardActive: 'ring-4 ring-white shadow-xl shadow-yellow-400/35',
			badgeBg: 'bg-slate-950/90 text-yellow-300',
			pricePill: 'bg-slate-950 text-yellow-300',
			accentBar: 'bg-yellow-400'
		},
		indigo: {
			cardBg:
				'bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-indigo-300 hover:from-indigo-500 hover:to-violet-600',
			cardActive: 'ring-4 ring-white shadow-xl shadow-indigo-500/35',
			badgeBg: 'bg-slate-950/90 text-indigo-200',
			pricePill: 'bg-slate-950 text-indigo-200',
			accentBar: 'bg-indigo-600'
		},
		orange: {
			cardBg:
				'bg-gradient-to-br from-orange-600 to-amber-800 text-white border-orange-300 hover:from-orange-500 hover:to-amber-700',
			cardActive: 'ring-4 ring-white shadow-xl shadow-orange-500/35',
			badgeBg: 'bg-slate-950/90 text-orange-200',
			pricePill: 'bg-slate-950 text-orange-200',
			accentBar: 'bg-orange-600'
		},
		cyan: {
			cardBg:
				'bg-gradient-to-br from-cyan-500 to-sky-700 text-white border-cyan-200 hover:from-cyan-400 hover:to-sky-600',
			cardActive: 'ring-4 ring-white shadow-xl shadow-cyan-500/35',
			badgeBg: 'bg-slate-950/90 text-cyan-200',
			pricePill: 'bg-slate-950 text-cyan-200',
			accentBar: 'bg-cyan-500'
		},
		emerald: {
			cardBg:
				'bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-emerald-300 hover:from-emerald-400 hover:to-teal-600',
			cardActive: 'ring-4 ring-white shadow-xl shadow-emerald-500/35',
			badgeBg: 'bg-slate-950/90 text-emerald-300',
			pricePill: 'bg-slate-950 text-emerald-300',
			accentBar: 'bg-emerald-500'
		}
	};

	const quickBills = [5000, 10000, 20000];

	function addCombo(productIds: string[]) {
		for (const id of productIds) {
			posStore.addProduct(id);
		}
	}

	function getQty(productId: string): number {
		return posStore.orderMap[productId] ?? 0;
	}
</script>

<!-- Banner Flotante de Éxito Instantáneo (0ms) no bloqueante con botón "Deshacer" -->
{#if posStore.lastPinchedSale}
	<div class="mx-auto max-w-7xl px-3 pt-2.5 sm:px-5">
		<div
			class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-500 px-4 py-2.5 text-slate-950 shadow-2xl shadow-emerald-500/25"
			role="status"
			aria-live="polite"
		>
			<div class="flex items-center gap-3">
				<div
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-emerald-400"
				>
					<CheckCircle2 class="h-5 w-5 stroke-[2.5]" />
				</div>
				<div>
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-sm font-black uppercase tracking-tight sm:text-base">
							¡Ticket #{posStore.lastPinchedSale.ticketNumber.toString().padStart(3, '0')} Guardado!
						</span>
						<span
							class="rounded-lg bg-slate-950 px-2.5 py-0.5 font-mono text-sm font-black text-emerald-300"
						>
							{formatCLP(posStore.lastPinchedSale.total)} CLP
						</span>
						{#if (posStore.lastPinchedSale.changeGiven ?? 0) > 0}
							<span
								class="rounded-lg bg-slate-900/15 px-2 py-0.5 text-xs font-black text-slate-950"
							>
								Vuelto: {formatCLP(posStore.lastPinchedSale.changeGiven ?? 0)} CLP
							</span>
						{/if}
					</div>
					<p class="text-xs font-bold text-slate-900">
						{posStore.lastPinchedSale.items.map((i) => `${i.quantity}x ${i.shortName}`).join(' • ')}
						— {formatTimeHHMM(posStore.lastPinchedSale.createdAt)}
					</p>
				</div>
			</div>

			<button
				type="button"
				onclick={() => posStore.undoLastSale()}
				class="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-slate-950 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300 shadow-md transition hover:bg-slate-900 active:scale-95"
			>
				<RotateCcw class="h-4 w-4 stroke-[2.5]" />
				<span>Deshacer</span>
			</button>
		</div>
	</div>
{/if}

<main class="mx-auto max-w-7xl px-3 py-3 sm:px-5 sm:py-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
		<!-- ================================================================== -->
		<!-- ZONA IZQUIERDA (7 COLUMNAS): PESTAÑAS + CATÁLOGO DE 46 PRODUCTOS   -->
		<!-- ================================================================== -->
		<section class="flex flex-col gap-3 lg:col-span-7" aria-label="Catálogo de productos por categoría">
			<!-- 1. NAVEGACIÓN POR PESTAÑAS PRINCIPALES (TABS GIGANTES TÁCTILES) -->
			<div
				class="grid grid-cols-3 gap-2 rounded-2xl border-2 border-slate-800 bg-slate-900/95 p-1.5 shadow-lg"
				role="tablist"
				aria-label="Categorías del menú"
			>
				<!-- TAB 1: EMPANADAS -->
				<button
					type="button"
					role="tab"
					aria-selected={activeCategory === 'empanada'}
					onclick={() => (activeCategory = 'empanada')}
					class="relative flex min-h-[58px] flex-col items-center justify-center rounded-xl px-2 py-2 text-center transition-all duration-75 active:scale-[0.97] sm:min-h-[64px] sm:flex-row sm:gap-2.5 sm:px-4 {activeCategory ===
					'empanada'
						? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-2 ring-amber-200'
						: 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}"
				>
					<span class="text-xl leading-none sm:text-2xl" aria-hidden="true">🥟</span>
					<div class="flex flex-col items-center sm:items-start">
						<span class="text-sm font-black uppercase tracking-tight sm:text-base">Empanadas</span>
						<span
							class="hidden text-[11px] font-extrabold sm:inline {activeCategory === 'empanada'
								? 'text-slate-900'
								: 'text-slate-400'}"
						>
							14 de $1.000 + 3 Esp.
						</span>
					</div>
					{#if categoryUnitCounts.empanada > 0}
						<span
							class="absolute -right-1 -top-1 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-emerald-500 px-1.5 font-mono text-xs font-black text-slate-950 ring-2 ring-slate-950 sm:static sm:ml-auto"
						>
							{categoryUnitCounts.empanada}
						</span>
					{/if}
				</button>

				<!-- TAB 2: AREPAS -->
				<button
					type="button"
					role="tab"
					aria-selected={activeCategory === 'arepa'}
					onclick={() => (activeCategory = 'arepa')}
					class="relative flex min-h-[58px] flex-col items-center justify-center rounded-xl px-2 py-2 text-center transition-all duration-75 active:scale-[0.97] sm:min-h-[64px] sm:flex-row sm:gap-2.5 sm:px-4 {activeCategory ===
					'arepa'
						? 'bg-gradient-to-br from-orange-400 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/25 ring-2 ring-orange-200'
						: 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}"
				>
					<span class="text-xl leading-none sm:text-2xl" aria-hidden="true">🫓</span>
					<div class="flex flex-col items-center sm:items-start">
						<span class="text-sm font-black uppercase tracking-tight sm:text-base">Arepas</span>
						<span
							class="hidden text-[11px] font-extrabold sm:inline {activeCategory === 'arepa'
								? 'text-slate-900'
								: 'text-slate-400'}"
						>
							9 Especialidades
						</span>
					</div>
					{#if categoryUnitCounts.arepa > 0}
						<span
							class="absolute -right-1 -top-1 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-emerald-500 px-1.5 font-mono text-xs font-black text-slate-950 ring-2 ring-slate-950 sm:static sm:ml-auto"
						>
							{categoryUnitCounts.arepa}
						</span>
					{/if}
				</button>

				<!-- TAB 3: BEBIDAS -->
				<button
					type="button"
					role="tab"
					aria-selected={activeCategory === 'bebida'}
					onclick={() => (activeCategory = 'bebida')}
					class="relative flex min-h-[58px] flex-col items-center justify-center rounded-xl px-2 py-2 text-center transition-all duration-75 active:scale-[0.97] sm:min-h-[64px] sm:flex-row sm:gap-2.5 sm:px-4 {activeCategory ===
					'bebida'
						? 'bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-200'
						: 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'}"
				>
					<span class="text-xl leading-none sm:text-2xl" aria-hidden="true">🥤</span>
					<div class="flex flex-col items-center sm:items-start">
						<span class="text-sm font-black uppercase tracking-tight sm:text-base">Bebidas</span>
						<span
							class="hidden text-[11px] font-extrabold sm:inline {activeCategory === 'bebida'
								? 'text-slate-900'
								: 'text-slate-400'}"
						>
							Refrescos y 10 Jugos
						</span>
					</div>
					{#if categoryUnitCounts.bebida > 0}
						<span
							class="absolute -right-1 -top-1 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-emerald-500 px-1.5 font-mono text-xs font-black text-slate-950 ring-2 ring-slate-950 sm:static sm:ml-auto"
						>
							{categoryUnitCounts.bebida}
						</span>
					{/if}
				</button>
			</div>

			<!-- ================================================================ -->
			<!-- VISTA PESTAÑA A: EMPANADAS (14 Tradicionales + 3 Especiales)     -->
			<!-- ================================================================ -->
			{#if activeCategory === 'empanada'}
				<!-- SUBSECCIÓN A.1: 14 EMPANADAS TRADICIONALES ($1.000 c/u) -->
				<div class="rounded-3xl border-2 border-slate-800 bg-slate-900/90 p-3 sm:p-4">
					<div class="mb-2.5 flex flex-wrap items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<span
								class="inline-flex items-center rounded-xl bg-amber-400 px-2.5 py-1 font-mono text-xs font-black uppercase text-slate-950"
							>
								$1.000 c/u
							</span>
							<h2 class="text-sm font-black uppercase tracking-wider text-white sm:text-base">
								Empanadas Tradicionales (14 Sabores)
							</h2>
						</div>
						<span class="text-xs font-bold text-slate-400">1 Toque = +1 Unidad</span>
					</div>

					<!-- Grilla compacta y ergonómica para los 14 sabores de $1.000 -->
					<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
						{#each empanadasTradicionales as product (product.id)}
							{@const qty = getQty(product.id)}
							{@const style = colorStyles[product.colorKey]}
							<div class="relative flex">
								<button
									type="button"
									onclick={() => posStore.addProduct(product.id)}
									class="group relative flex min-h-[78px] w-full flex-col justify-between rounded-2xl border-2 p-2.5 text-left transition-all duration-75 active:scale-[0.97] sm:min-h-[84px] sm:p-3 {qty >
									0
										? `${style.cardBg} ${style.cardActive}`
										: 'border-slate-700/90 bg-slate-800/90 text-white hover:border-amber-400/70 hover:bg-slate-800'}"
								>
									<div class="flex w-full items-start justify-between gap-1">
										<div class="flex items-center gap-1.5">
											<span class="text-lg leading-none" aria-hidden="true">{product.emoji}</span>
											<span
												class="rounded px-1.5 py-0.5 font-mono text-[10px] font-black uppercase {qty >
												0
													? style.badgeBg
													: 'bg-slate-950 text-amber-300'}"
											>
												{product.badgeCode}
											</span>
										</div>

										{#if qty > 0}
											<span
												class="inline-flex h-7 min-w-[34px] items-center justify-center rounded-lg bg-slate-950 px-1.5 font-mono text-sm font-black text-emerald-400 ring-2 ring-emerald-400"
											>
												{qty}x
											</span>
										{:else}
											<span class="font-mono text-xs font-black text-amber-300">$1.000</span>
										{/if}
									</div>

									<div class="mt-1 flex items-end justify-between gap-1">
										<span
											class="text-base font-black leading-tight tracking-tight sm:text-[17px] {qty >
											0
												? ''
												: 'text-white'}"
										>
											{product.shortName}
										</span>
										{#if qty > 0}
											<span class="font-mono text-xs font-black opacity-90">
												{formatCLP(product.price * qty)}
											</span>
										{/if}
									</div>
								</button>

								{#if qty > 0}
									<button
										type="button"
										onclick={(e) => {
											e.stopPropagation();
											posStore.decrementProduct(product.id);
										}}
										class="absolute -bottom-1.5 -right-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-rose-600 text-white shadow-lg transition hover:bg-rose-500 active:scale-90"
										title="Restar 1 {product.shortName}"
										aria-label="Restar 1 {product.shortName}"
									>
										<Minus class="h-4 w-4 stroke-[3]" />
									</button>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- SUBSECCIÓN A.2: BLOQUE SEPARADO DE EMPANADAS ESPECIALES (Para evitar cobros erróneos) -->
				<div
					class="rounded-3xl border-2 border-amber-400/70 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 p-3 shadow-xl sm:p-4"
				>
					<div class="mb-2.5 flex flex-wrap items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<span
								class="inline-flex items-center gap-1 rounded-xl bg-amber-400 px-2.5 py-1 text-xs font-black uppercase text-slate-950"
							>
								<Star class="h-3.5 w-3.5 fill-slate-950" />
								Especiales
							</span>
							<h3 class="text-sm font-black uppercase tracking-wider text-amber-300 sm:text-base">
								Empanadas Especiales (Precios Diferenciados)
							</h3>
						</div>
						<span
							class="rounded-lg border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[11px] font-extrabold text-amber-200"
						>
							⚠️ Atención al precio
						</span>
					</div>

					<div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
						{#each empanadasEspeciales as product (product.id)}
							{@const qty = getQty(product.id)}
							{@const style = colorStyles[product.colorKey]}
							<div class="relative flex">
								<button
									type="button"
									onclick={() => posStore.addProduct(product.id)}
									class="group relative flex min-h-[100px] w-full flex-col justify-between rounded-2xl border-2 p-3 text-left transition-all duration-75 active:scale-[0.97] {style.cardBg} {qty >
									0
										? style.cardActive
										: 'shadow-lg'}"
								>
									<div class="flex w-full items-start justify-between gap-1.5">
										<span
											class="inline-flex items-center rounded-lg px-2 py-0.5 font-mono text-[11px] font-black uppercase tracking-wider {style.badgeBg}"
										>
											{product.badgeCode}
										</span>

										{#if qty > 0}
											<span
												class="inline-flex h-8 min-w-[40px] items-center justify-center rounded-xl bg-slate-950 px-2 font-mono text-base font-black text-emerald-400 ring-2 ring-emerald-400"
											>
												{qty}x
											</span>
										{:else}
											<span class="text-xl leading-none" aria-hidden="true">{product.emoji}</span>
										{/if}
									</div>

									<div class="my-1">
										<div class="text-xl font-black leading-tight tracking-tight">
											{product.shortName}
										</div>
										<p class="line-clamp-1 text-[11px] font-bold opacity-90">
											{product.subtitle}
										</p>
									</div>

									<div class="flex w-full items-center justify-between pt-0.5">
										<span
											class="inline-flex items-center rounded-xl px-2.5 py-0.5 font-mono text-base font-black tracking-tight shadow-sm {style.pricePill}"
										>
											{formatCLP(product.price)}
										</span>
										<span
											class="inline-flex items-center gap-0.5 rounded-lg bg-black/25 px-2 py-0.5 text-[11px] font-black uppercase"
										>
											<Plus class="h-3.5 w-3.5 stroke-[3]" />
											Sumar
										</span>
									</div>
								</button>

								{#if qty > 0}
									<button
										type="button"
										onclick={(e) => {
											e.stopPropagation();
											posStore.decrementProduct(product.id);
										}}
										class="absolute -bottom-2 -right-2 z-10 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-rose-600 text-white shadow-lg transition hover:bg-rose-500 active:scale-90"
										title="Restar 1 {product.shortName}"
										aria-label="Restar 1 {product.shortName}"
									>
										<Minus class="h-4 w-4 stroke-[3]" />
									</button>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- ================================================================ -->
			<!-- VISTA PESTAÑA B: AREPAS (9 Opciones entre $2.000 y $5.000)       -->
			<!-- ================================================================ -->
			{#if activeCategory === 'arepa'}
				<div class="rounded-3xl border-2 border-slate-800 bg-slate-900/90 p-3 sm:p-4">
					<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<span
								class="inline-flex items-center rounded-xl bg-orange-400 px-2.5 py-1 font-mono text-xs font-black uppercase text-slate-950"
							>
								🫓 Arepas
							</span>
							<h2 class="text-sm font-black uppercase tracking-wider text-white sm:text-base">
								Arepas Venezolanas y Desayuno ($2.000 - $5.000)
							</h2>
						</div>
						<span class="text-xs font-bold text-slate-400">Toca para anotar al ticket</span>
					</div>

					<div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
						{#each arepasList as product (product.id)}
							{@const qty = getQty(product.id)}
							{@const style = colorStyles[product.colorKey]}
							<div class="relative flex">
								<button
									type="button"
									onclick={() => posStore.addProduct(product.id)}
									class="group relative flex min-h-[104px] w-full flex-col justify-between rounded-2xl border-2 p-3 text-left transition-all duration-75 active:scale-[0.97] {style.cardBg} {qty >
									0
										? style.cardActive
										: 'shadow-lg'}"
								>
									<div class="flex w-full items-start justify-between gap-2">
										<div class="flex items-center gap-1.5">
											<span
												class="inline-flex items-center rounded-lg px-2 py-0.5 font-mono text-xs font-black uppercase {style.badgeBg}"
											>
												{product.badgeCode}
											</span>
											<span class="text-xl leading-none" aria-hidden="true">{product.emoji}</span>
										</div>

										{#if qty > 0}
											<span
												class="inline-flex h-8 min-w-[40px] items-center justify-center rounded-xl bg-slate-950 px-2 font-mono text-base font-black text-emerald-400 ring-2 ring-emerald-400"
											>
												{qty}x
											</span>
										{/if}
									</div>

									<div class="my-1">
										<div class="text-lg font-black leading-tight tracking-tight sm:text-xl">
											{product.shortName}
										</div>
										<p class="line-clamp-1 text-[11px] font-bold opacity-90">
											{product.subtitle}
										</p>
									</div>

									<div class="flex w-full items-center justify-between pt-1">
										<span
											class="inline-flex items-center rounded-xl px-2.5 py-0.5 font-mono text-base font-black tracking-tight shadow-sm sm:text-lg {style.pricePill}"
										>
											{formatCLP(product.price)}
										</span>
										<span
											class="inline-flex items-center gap-1 rounded-lg bg-black/20 px-2 py-0.5 text-[11px] font-black uppercase"
										>
											<Plus class="h-3.5 w-3.5 stroke-[3]" />
											Sumar
										</span>
									</div>
								</button>

								{#if qty > 0}
									<button
										type="button"
										onclick={(e) => {
											e.stopPropagation();
											posStore.decrementProduct(product.id);
										}}
										class="absolute -bottom-2 -right-2 z-10 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-rose-600 text-white shadow-lg transition hover:bg-rose-500 active:scale-90"
										title="Restar 1 {product.shortName}"
										aria-label="Restar 1 {product.shortName}"
									>
										<Minus class="h-4 w-4 stroke-[3]" />
									</button>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- ================================================================ -->
			<!-- VISTA PESTAÑA C: BEBIDAS (Refrescos, Jugos $2.000 y Grandes)     -->
			<!-- ================================================================ -->
			{#if activeCategory === 'bebida'}
				<div class="flex flex-col gap-3">
					<!-- Filtros rápidos internos de Bebidas -->
					<div class="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900 p-1.5">
						<button
							type="button"
							onclick={() => (bebidaSubFilter = 'all')}
							class="rounded-xl px-3 py-2 text-xs font-black uppercase transition {bebidaSubFilter ===
							'all'
								? 'bg-cyan-400 text-slate-950 shadow'
								: 'text-slate-300 hover:bg-slate-800'}"
						>
							Todas (20)
						</button>
						<button
							type="button"
							onclick={() => (bebidaSubFilter = 'refresco')}
							class="rounded-xl px-3 py-2 text-xs font-black uppercase transition {bebidaSubFilter ===
							'refresco'
								? 'bg-cyan-400 text-slate-950 shadow'
								: 'text-slate-300 hover:bg-slate-800'}"
						>
							🥤 Refrescos (8)
						</button>
						<button
							type="button"
							onclick={() => (bebidaSubFilter = 'jugo')}
							class="rounded-xl px-3 py-2 text-xs font-black uppercase transition {bebidaSubFilter ===
							'jugo'
								? 'bg-emerald-400 text-slate-950 shadow'
								: 'text-slate-300 hover:bg-slate-800'}"
						>
							🍓 Jugos Naturales $2.000 (10)
						</button>
						<button
							type="button"
							onclick={() => (bebidaSubFilter = 'grande')}
							class="rounded-xl px-3 py-2 text-xs font-black uppercase transition {bebidaSubFilter ===
							'grande'
								? 'bg-amber-400 text-slate-950 shadow'
								: 'text-slate-300 hover:bg-slate-800'}"
						>
							🍾 Formatos Grandes (2)
						</button>
					</div>

					<!-- SUBSECCIÓN C.1: REFRESCOS (Gaseosas y Tradicionales) -->
					{#if bebidaSubFilter === 'all' || bebidaSubFilter === 'refresco'}
						<div class="rounded-3xl border-2 border-slate-800 bg-slate-900/90 p-3 sm:p-4">
							<div class="mb-2.5 flex items-center justify-between">
								<div class="flex items-center gap-2">
									<span
										class="rounded-xl bg-cyan-400 px-2.5 py-1 font-mono text-xs font-black uppercase text-slate-950"
									>
										Refrescos
									</span>
									<h3 class="text-sm font-black uppercase tracking-wider text-white">
										Gaseosas y Tradicionales ($1.500 - $2.000)
									</h3>
								</div>
							</div>

							<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
								{#each bebidasRefrescos as product (product.id)}
									{@const qty = getQty(product.id)}
									{@const style = colorStyles[product.colorKey]}
									<div class="relative flex">
										<button
											type="button"
											onclick={() => posStore.addProduct(product.id)}
											class="group relative flex min-h-[82px] w-full flex-col justify-between rounded-2xl border-2 p-2.5 text-left transition-all duration-75 active:scale-[0.97] {qty >
											0
												? `${style.cardBg} ${style.cardActive}`
												: 'border-slate-700/90 bg-slate-800/90 text-white hover:border-cyan-400/70 hover:bg-slate-800'}"
										>
											<div class="flex w-full items-center justify-between gap-1">
												<span class="text-lg leading-none" aria-hidden="true">{product.emoji}</span>
												{#if qty > 0}
													<span
														class="inline-flex h-7 min-w-[32px] items-center justify-center rounded-lg bg-slate-950 px-1.5 font-mono text-sm font-black text-emerald-400 ring-2 ring-emerald-400"
													>
														{qty}x
													</span>
												{:else}
													<span
														class="rounded-md bg-slate-950 px-1.5 py-0.5 font-mono text-xs font-black text-cyan-300"
													>
														{formatCLP(product.price)}
													</span>
												{/if}
											</div>

											<div class="mt-1">
												<div class="text-sm font-black leading-tight sm:text-base">
													{product.shortName}
												</div>
												<div class="font-mono text-[11px] font-bold opacity-80">
													{formatCLP(product.price)}
												</div>
											</div>
										</button>

										{#if qty > 0}
											<button
												type="button"
												onclick={(e) => {
													e.stopPropagation();
													posStore.decrementProduct(product.id);
												}}
												class="absolute -bottom-1.5 -right-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-rose-600 text-white shadow-lg transition hover:bg-rose-500 active:scale-90"
												title="Restar 1 {product.shortName}"
												aria-label="Restar 1 {product.shortName}"
											>
												<Minus class="h-4 w-4 stroke-[3]" />
											</button>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- SUBSECCIÓN C.2: JUGOS NATURALES ($2.000 c/u) - 10 SABORES COMPACTOS -->
					{#if bebidaSubFilter === 'all' || bebidaSubFilter === 'jugo'}
						<div class="rounded-3xl border-2 border-emerald-500/40 bg-slate-900/95 p-3 sm:p-4">
							<div class="mb-2.5 flex flex-wrap items-center justify-between gap-2">
								<div class="flex items-center gap-2">
									<span
										class="rounded-xl bg-emerald-400 px-2.5 py-1 font-mono text-xs font-black uppercase text-slate-950"
									>
										$2.000 c/u
									</span>
									<h3 class="text-sm font-black uppercase tracking-wider text-emerald-300">
										Jugos Naturales (10 Sabores)
									</h3>
								</div>
								<span class="text-xs font-bold text-slate-400">Toque directo = +1 Jugo</span>
							</div>

							<div class="grid grid-cols-2 gap-2 sm:grid-cols-5">
								{#each bebidasJugos as product (product.id)}
									{@const qty = getQty(product.id)}
									{@const style = colorStyles[product.colorKey]}
									<div class="relative flex">
										<button
											type="button"
											onclick={() => posStore.addProduct(product.id)}
											class="group relative flex min-h-[74px] w-full flex-col justify-between rounded-2xl border-2 p-2.5 text-left transition-all duration-75 active:scale-[0.97] {qty >
											0
												? `${style.cardBg} ${style.cardActive}`
												: 'border-slate-700/80 bg-slate-800/85 text-white hover:border-emerald-400/70 hover:bg-slate-800'}"
										>
											<div class="flex w-full items-center justify-between gap-1">
												<span class="text-lg leading-none" aria-hidden="true">{product.emoji}</span>
												{#if qty > 0}
													<span
														class="inline-flex h-6 min-w-[28px] items-center justify-center rounded-md bg-slate-950 px-1 font-mono text-xs font-black text-emerald-400 ring-1 ring-emerald-400"
													>
														{qty}x
													</span>
												{:else}
													<span class="font-mono text-[11px] font-black text-emerald-300">
														$2.000
													</span>
												{/if}
											</div>

											<div class="mt-1">
												<div class="text-xs font-black leading-tight sm:text-sm">
													{product.name}
												</div>
												<div class="font-mono text-[10px] font-bold opacity-80">
													{formatCLP(product.price)}
												</div>
											</div>
										</button>

										{#if qty > 0}
											<button
												type="button"
												onclick={(e) => {
													e.stopPropagation();
													posStore.decrementProduct(product.id);
												}}
												class="absolute -bottom-1.5 -right-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-white bg-rose-600 text-white shadow-lg transition hover:bg-rose-500 active:scale-90"
												title="Restar 1 {product.name}"
												aria-label="Restar 1 {product.name}"
											>
												<Minus class="h-3.5 w-3.5 stroke-[3]" />
											</button>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- SUBSECCIÓN C.3: FORMATOS GRANDES -->
					{#if bebidaSubFilter === 'all' || bebidaSubFilter === 'grande'}
						<div class="rounded-3xl border-2 border-amber-400/50 bg-slate-900/90 p-3 sm:p-4">
							<div class="mb-2.5 flex items-center justify-between">
								<div class="flex items-center gap-2">
									<span
										class="rounded-xl bg-amber-400 px-2.5 py-1 font-mono text-xs font-black uppercase text-slate-950"
									>
										Grandes
									</span>
									<h3 class="text-sm font-black uppercase tracking-wider text-amber-300">
										Formatos Grandes Para Compartir
									</h3>
								</div>
							</div>

							<div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
								{#each bebidasGrandes as product (product.id)}
									{@const qty = getQty(product.id)}
									{@const style = colorStyles[product.colorKey]}
									<div class="relative flex">
										<button
											type="button"
											onclick={() => posStore.addProduct(product.id)}
											class="group relative flex min-h-[88px] w-full items-center justify-between rounded-2xl border-2 p-3.5 text-left transition-all duration-75 active:scale-[0.97] {style.cardBg} {qty >
											0
												? style.cardActive
												: 'shadow-lg'}"
										>
											<div class="flex items-center gap-3">
												<span class="text-3xl leading-none" aria-hidden="true">{product.emoji}</span>
												<div>
													<span
														class="inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-black uppercase {style.badgeBg}"
													>
														{product.badgeCode}
													</span>
													<div class="mt-0.5 text-lg font-black leading-tight sm:text-xl">
														{product.name}
													</div>
												</div>
											</div>

											<div class="flex items-center gap-2">
												<span
													class="rounded-xl px-3 py-1.5 font-mono text-lg font-black {style.pricePill}"
												>
													{formatCLP(product.price)}
												</span>
												{#if qty > 0}
													<span
														class="inline-flex h-9 min-w-[40px] items-center justify-center rounded-xl bg-slate-950 px-2 font-mono text-base font-black text-emerald-400 ring-2 ring-emerald-400"
													>
														{qty}x
													</span>
												{/if}
											</div>
										</button>

										{#if qty > 0}
											<button
												type="button"
												onclick={(e) => {
													e.stopPropagation();
													posStore.decrementProduct(product.id);
												}}
												class="absolute -bottom-2 -right-2 z-10 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-rose-600 text-white shadow-lg transition hover:bg-rose-500 active:scale-90"
												title="Restar 1 {product.name}"
												aria-label="Restar 1 {product.name}"
											>
												<Minus class="h-4 w-4 stroke-[3]" />
											</button>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- ATAJOS DE COMBOS FRECUENTES EN LA VEGA (1 Solo Toque) -->
			<div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
				<div
					class="mb-2 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300"
				>
					<Sparkles class="h-3.5 w-3.5" />
					<span>Combos Rápidos (1 Toque)</span>
				</div>
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
					<button
						type="button"
						onclick={() => addCombo(['emp-mechada', 'emp-mechada', 'beb-malta'])}
						class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-left text-xs font-bold text-white transition hover:border-amber-400 hover:bg-slate-800 active:scale-95"
					>
						<span>2 Emp. Mechada + Malta</span>
						<span class="rounded-md bg-amber-400/20 px-2 py-0.5 font-mono font-black text-amber-300">
							$4.000
						</span>
					</button>
					<button
						type="button"
						onclick={() => addCombo(['are-pabellon', 'jug-maracuya'])}
						class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-left text-xs font-bold text-white transition hover:border-amber-400 hover:bg-slate-800 active:scale-95"
					>
						<span>Arepa Pabellón + Jugo</span>
						<span class="rounded-md bg-amber-400/20 px-2 py-0.5 font-mono font-black text-amber-300">
							$6.500
						</span>
					</button>
					<button
						type="button"
						onclick={() => addCombo(['are-desayuno-criollo', 'beb-papelon'])}
						class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-left text-xs font-bold text-white transition hover:border-amber-400 hover:bg-slate-800 active:scale-95"
					>
						<span>Desayuno Criollo + Papelón</span>
						<span class="rounded-md bg-amber-400/20 px-2 py-0.5 font-mono font-black text-amber-300">
							$7.000
						</span>
					</button>
				</div>
			</div>
		</section>

		<!-- ================================================================== -->
		<!-- ZONA DERECHA (5 COLUMNAS): TICKET DIGITAL + VUELTO + COBRAR        -->
		<!-- ================================================================== -->
		<aside
			class="flex flex-col gap-3 lg:col-span-5 lg:sticky lg:top-20"
			aria-label="Ticket del pedido actual y cobro"
		>
			<div
				class="overflow-hidden rounded-3xl border-4 border-amber-400/80 bg-paper-50 text-slate-950 shadow-2xl"
			>
				<!-- Cabecera del Ticket Digital -->
				<div
					class="flex items-center justify-between border-b-2 border-dashed border-slate-300 bg-amber-100/80 px-4 py-3"
				>
					<div class="flex items-center gap-2">
						<span
							class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 font-mono text-xs font-black text-amber-400"
						>
							<Pin class="h-4 w-4" />
						</span>
						<div>
							<h2 class="text-base font-black uppercase tracking-tight text-slate-950">
								Ticket #{posStore.nextTicketNumber.toString().padStart(3, '0')}
							</h2>
							<p class="text-xs font-bold text-slate-600">
								{posStore.currentTotalUnits === 0
									? 'Esperando pedido...'
									: `${posStore.currentTotalUnits} ${posStore.currentTotalUnits === 1 ? 'unidad anotada' : 'unidades anotadas'}`}
							</p>
						</div>
					</div>

					{#if posStore.orderItems.length > 0}
						<button
							type="button"
							onclick={() => posStore.clearCurrentOrder()}
							class="flex min-h-[38px] items-center gap-1.5 rounded-xl border-2 border-rose-300 bg-rose-100 px-3 py-1 text-xs font-black uppercase text-rose-800 transition hover:bg-rose-200 active:scale-95"
							title="Vaciar todo el ticket actual"
						>
							<Trash2 class="h-4 w-4 stroke-[2.5]" />
							<span>Vaciar</span>
						</button>
					{/if}
				</div>

				<!-- Cuerpo del Ticket: Lista de líneas con botones (-), (+) y (🗑️) -->
				<div
					class="custom-scrollbar max-h-[290px] min-h-[165px] overflow-y-auto px-3 py-2 sm:px-4"
				>
					{#if posStore.orderItems.length === 0}
						<div class="flex h-[150px] flex-col items-center justify-center text-center">
							<p class="text-lg font-black uppercase text-slate-400">Ticket en blanco</p>
							<p class="mt-1 max-w-xs text-xs font-bold text-slate-500">
								Toca cualquier empanada, arepa o bebida a la izquierda para sumarla al instante.
							</p>
						</div>
					{:else}
						<ul class="divide-y-2 divide-dashed divide-slate-200">
							{#each posStore.orderItems as item (item.product.id)}
								{@const style = colorStyles[item.product.colorKey]}
								<li class="flex items-center justify-between gap-2 py-2">
									<div class="flex min-w-0 flex-1 items-center gap-2">
										<span class="h-9 w-2 shrink-0 rounded-full {style.accentBar}"></span>
										<div class="min-w-0 flex-1">
											<div class="flex items-baseline gap-1.5">
												<span class="font-mono text-lg font-black text-slate-950">
													{item.quantity}x
												</span>
												<span class="truncate text-base font-black text-slate-900">
													{item.product.name}
												</span>
											</div>
											<div class="flex items-center gap-2 font-mono text-xs font-bold text-slate-600">
												<span>{formatCLP(item.product.price)} c/u</span>
												<span>•</span>
												<span class="font-black text-slate-900">
													Subtotal: {formatCLP(item.subtotal)}
												</span>
											</div>
										</div>
									</div>

									<!-- Controles Táctiles por línea: (-), (+) y eliminación directa (🗑️) -->
									<div class="flex shrink-0 items-center gap-1">
										<button
											type="button"
											onclick={() => posStore.decrementProduct(item.product.id)}
											class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-amber-300 bg-amber-500 text-slate-950 shadow-sm transition hover:bg-amber-400 active:scale-90"
											title="Restar 1 unidad de {item.product.name}"
											aria-label="Restar 1 unidad de {item.product.name}"
										>
											<Minus class="h-4 w-4 stroke-[3]" />
										</button>
										<button
											type="button"
											onclick={() => posStore.addProduct(item.product.id)}
											class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-emerald-300 bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-500 active:scale-90"
											title="Sumar 1 unidad de {item.product.name}"
											aria-label="Sumar 1 unidad de {item.product.name}"
										>
											<Plus class="h-4 w-4 stroke-[3]" />
										</button>
										<button
											type="button"
											onclick={() => posStore.removeLine(item.product.id)}
											class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-rose-300 bg-rose-600 text-white shadow-sm transition hover:bg-rose-500 active:scale-90"
											title="Eliminar línea de {item.product.name}"
											aria-label="Eliminar línea de {item.product.name}"
										>
											<Trash2 class="h-4 w-4 stroke-[2.5]" />
										</button>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- ZONA DE TOTAL ACUMULADO FORMATEADO EN MONEDA CHILENA (CLP) -->
				<div class="border-t-2 border-slate-900 bg-slate-950 px-4 py-3 text-white">
					<div class="flex items-baseline justify-between gap-2">
						<span class="text-xs font-black uppercase tracking-wider text-amber-400 sm:text-sm">
							Total Acumulado:
						</span>
						<span
							class="font-mono text-3xl font-black tracking-tight text-white tabular-nums sm:text-4xl"
						>
							{formatCLP(posStore.currentTotal)} <span class="text-lg font-extrabold text-amber-400">CLP</span>
						</span>
					</div>
				</div>

				<!-- CALCULADORA DE VUELTO RÁPIDA (Billetes Chilenos de 1 Toque) -->
				<div class="border-t border-slate-800 bg-slate-900 px-4 py-3 text-white">
					<div class="mb-2 flex items-center justify-between">
						<div
							class="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-300"
						>
							<Calculator class="h-4 w-4 text-amber-400" />
							<span>¿Con cuánto paga? (Vuelto Rápido)</span>
						</div>
						{#if posStore.cashReceived > 0}
							<button
								type="button"
								onclick={() => posStore.setCashBill(0)}
								class="text-xs font-bold text-amber-400 underline hover:text-amber-300"
							>
								Reiniciar billete
							</button>
						{/if}
					</div>

					<div class="grid grid-cols-4 gap-1.5">
						<button
							type="button"
							disabled={posStore.currentTotal === 0}
							onclick={() => posStore.setCashBill(posStore.currentTotal)}
							class="min-h-[42px] rounded-xl border-2 font-mono text-xs font-black uppercase transition active:scale-95 disabled:opacity-40 sm:text-sm {posStore.cashReceived >
								0 && posStore.cashReceived === posStore.currentTotal
								? 'border-amber-400 bg-amber-400 text-slate-950'
								: 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'}"
						>
							Exacto
						</button>

						{#each quickBills as bill}
							<button
								type="button"
								disabled={posStore.currentTotal === 0}
								onclick={() => posStore.setCashBill(bill)}
								class="min-h-[42px] rounded-xl border-2 font-mono text-xs font-black transition active:scale-95 disabled:opacity-40 sm:text-sm {posStore.cashReceived ===
								bill
									? 'border-amber-400 bg-amber-400 text-slate-950'
									: 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'}"
							>
								{formatCLP(bill)}
							</button>
						{/each}
					</div>

					{#if posStore.currentTotal > 0}
						<div class="mt-1.5 grid grid-cols-3 gap-1.5">
							{#each [1000, 2000, 5000] as extraBill}
								<button
									type="button"
									onclick={() => posStore.setCashBill(extraBill, true)}
									class="min-h-[34px] rounded-lg border border-slate-700 bg-slate-800/70 font-mono text-xs font-bold text-slate-300 transition hover:bg-slate-700 active:scale-95"
								>
									+{formatCLP(extraBill)}
								</button>
							{/each}
						</div>
					{/if}

					{#if posStore.currentTotal > 0 && posStore.cashReceived > 0}
						<div
							class="mt-2.5 flex items-center justify-between rounded-2xl border-2 px-3.5 py-2 {posStore.changeAmount >=
							0
								? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-300'
								: 'border-rose-400/60 bg-rose-500/15 text-rose-300'}"
						>
							<div class="flex items-center gap-2">
								<Banknote class="h-5 w-5 shrink-0" />
								<div class="text-xs font-bold leading-tight">
									<div>
										Paga con: <strong class="font-mono">{formatCLP(posStore.cashReceived)} CLP</strong>
									</div>
									<div class="uppercase tracking-wider">
										{posStore.changeAmount >= 0 ? 'Vuelto a entregar:' : 'Falta por cobrar:'}
									</div>
								</div>
							</div>
							<span class="font-mono text-2xl font-black tabular-nums sm:text-3xl">
								{formatCLP(Math.abs(posStore.changeAmount))} CLP
							</span>
						</div>
					{/if}
				</div>

				<!-- BOTÓN DE ACCIÓN PRINCIPAL: "COBRAR / GUARDAR TICKET" -->
				<div class="bg-slate-950 p-3.5">
					<button
						type="button"
						disabled={posStore.orderItems.length === 0}
						onclick={() => posStore.pincharPapel()}
						class="flex min-h-[76px] w-full items-center justify-center gap-3 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 to-emerald-400 px-5 py-3.5 text-slate-950 shadow-xl shadow-emerald-500/25 transition-all hover:from-emerald-400 hover:to-emerald-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-slate-800 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none"
					>
						<Pin class="h-7 w-7 shrink-0 stroke-[2.75]" />
						<div class="flex flex-col items-start text-left leading-none">
							<span class="text-lg font-black uppercase tracking-tight sm:text-xl">
								{posStore.orderItems.length === 0
									? 'Cobrar / Guardar Ticket'
									: `Cobrar / Guardar Ticket • ${formatCLP(posStore.currentTotal)} CLP`}
							</span>
							<span class="mt-1 text-xs font-extrabold uppercase tracking-wider opacity-85">
								{posStore.orderItems.length === 0
									? 'Selecciona productos del menú para empezar'
									: 'Guarda el pedido y limpia al instante para el siguiente cliente'}
							</span>
						</div>
					</button>
				</div>
			</div>
		</aside>
	</div>
</main>
