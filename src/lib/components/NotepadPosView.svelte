<script lang="ts">
	import { posStore } from '$lib/stores/pos.svelte';
	import type { Product, ProductColorKey } from '$lib/types/pos';
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
		Utensils,
		CupSoda
	} from 'lucide-svelte';

	const empanadas = $derived(posStore.products.filter((p) => p.category === 'empanada'));
	const bebidas = $derived(posStore.products.filter((p) => p.category === 'bebida'));

	// Estilos de alto contraste AAA pensados para identificación cromática instantánea (Memoria Muscular)
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

<!-- Banner Flotante de Éxito Instantáneo (0ms) con botón "Deshacer" -->
{#if posStore.lastPinchedSale}
	<div class="mx-auto max-w-7xl px-3 pt-2.5 sm:px-5">
		<div
			class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-500 px-4 py-3 text-slate-950 shadow-2xl shadow-emerald-500/25"
			role="status"
			aria-live="polite"
		>
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-emerald-400">
					<CheckCircle2 class="h-6 w-6 stroke-[2.5]" />
				</div>
				<div>
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-base font-black uppercase tracking-tight sm:text-lg">
							¡Papel #{posStore.lastPinchedSale.ticketNumber.toString().padStart(3, '0')} Pinchado!
						</span>
						<span class="rounded-lg bg-slate-950 px-2.5 py-0.5 font-mono text-sm font-black text-emerald-300">
							{formatCLP(posStore.lastPinchedSale.total)}
						</span>
						{#if (posStore.lastPinchedSale.changeGiven ?? 0) > 0}
							<span class="rounded-lg bg-slate-900/15 px-2 py-0.5 text-xs font-black text-slate-950">
								Vuelto dado: {formatCLP(posStore.lastPinchedSale.changeGiven ?? 0)}
							</span>
						{/if}
					</div>
					<p class="text-xs font-bold text-slate-900">
						{posStore.lastPinchedSale.items.map((i) => `${i.quantity}x ${i.shortName}`).join(' • ')}
						— Guardado a las {formatTimeHHMM(posStore.lastPinchedSale.createdAt)}
					</p>
				</div>
			</div>

			<button
				type="button"
				onclick={() => posStore.undoLastSale()}
				class="flex min-h-[44px] items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-wider text-amber-300 shadow-md transition hover:bg-slate-900 active:scale-95 sm:text-sm"
			>
				<RotateCcw class="h-4 w-4 stroke-[2.5]" />
				<span>Deshacer Venta</span>
			</button>
		</div>
	</div>
{/if}

<main class="mx-auto max-w-7xl px-3 py-3 sm:px-5 sm:py-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
		<!-- ================================================================== -->
		<!-- ZONA IZQUIERDA (7 COLUMNAS): GRILLA DE PRODUCTOS TÁCTIL GIGANTE    -->
		<!-- ================================================================== -->
		<section class="flex flex-col gap-3.5 lg:col-span-7" aria-label="Botones de productos">
			<!-- SECCIÓN 1: EMPANADAS VENEZOLANAS -->
			<div class="rounded-3xl border-2 border-slate-800 bg-slate-900/90 p-3 sm:p-4">
				<div class="mb-3 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300">
							<Utensils class="h-4 w-4 stroke-[2.5]" />
						</span>
						<h2 class="text-sm font-black uppercase tracking-wider text-slate-200 sm:text-base">
							Empanadas (Toca para sumar)
						</h2>
					</div>
					<span class="text-xs font-bold text-slate-400">1 Toque = +1 Unidad</span>
				</div>

				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{#each empanadas as product (product.id)}
						{@const qty = getQty(product.id)}
						{@const style = colorStyles[product.colorKey]}
						<div class="relative flex">
							<button
								type="button"
								onclick={() => posStore.addProduct(product.id)}
								class="group relative flex min-h-[118px] w-full flex-col justify-between rounded-2xl border-2 p-3.5 text-left transition-all duration-75 active:scale-[0.97] sm:min-h-[132px] sm:p-4 {style.cardBg} {qty >
								0
									? style.cardActive
									: 'shadow-lg'}"
							>
								<!-- Fila Superior: Código + Emoji + Contador Activo -->
								<div class="flex w-full items-start justify-between gap-2">
									<div class="flex items-center gap-2">
										<span
											class="inline-flex items-center rounded-lg px-2 py-0.5 font-mono text-xs font-black uppercase tracking-wider {style.badgeBg}"
										>
											{product.badgeCode}
										</span>
										<span class="text-2xl leading-none" aria-hidden="true">{product.emoji}</span>
									</div>

									{#if qty > 0}
										<span
											class="inline-flex h-10 min-w-[48px] items-center justify-center rounded-xl bg-slate-950 px-2.5 font-mono text-xl font-black text-emerald-400 ring-2 ring-emerald-400"
										>
											{qty}x
										</span>
									{/if}
								</div>

								<!-- Fila Central: Nombre Gigante + Descripción corta -->
								<div class="my-1.5">
									<div class="text-2xl font-black leading-tight tracking-tight sm:text-[26px]">
										{product.shortName}
									</div>
									<p class="line-clamp-1 text-xs font-bold opacity-90 sm:text-sm">
										{product.subtitle}
									</p>
								</div>

								<!-- Fila Inferior: Precio en CLP Grande -->
								<div class="flex w-full items-center justify-between pt-1">
									<span
										class="inline-flex items-center rounded-xl px-3 py-1 font-mono text-lg font-black tracking-tight shadow-sm sm:text-xl {style.pricePill}"
									>
										{formatCLP(product.price)}
									</span>

									<span
										class="inline-flex items-center gap-1 rounded-xl bg-black/20 px-2.5 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-sm"
									>
										<Plus class="h-4 w-4 stroke-[3]" />
										Sumar
									</span>
								</div>
							</button>

							<!-- Botón flotante rápido para restar -1 directamente desde la tarjeta si se equivocó -->
							{#if qty > 0}
								<button
									type="button"
									onclick={(e) => {
										e.stopPropagation();
										posStore.decrementProduct(product.id);
									}}
									class="absolute -bottom-2 -right-2 z-10 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white bg-rose-600 text-white shadow-lg transition hover:bg-rose-500 active:scale-90"
									title="Restar 1 {product.shortName}"
									aria-label="Restar 1 {product.shortName}"
								>
									<Minus class="h-5 w-5 stroke-[3]" />
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- SECCIÓN 2: BEBIDAS Y MALTA -->
			<div class="rounded-3xl border-2 border-slate-800 bg-slate-900/90 p-3 sm:p-4">
				<div class="mb-3 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-300">
							<CupSoda class="h-4 w-4 stroke-[2.5]" />
						</span>
						<h2 class="text-sm font-black uppercase tracking-wider text-slate-200 sm:text-base">
							Bebidas Heladas
						</h2>
					</div>
					<span class="text-xs font-bold text-slate-400">Para acompañar</span>
				</div>

				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{#each bebidas as product (product.id)}
						{@const qty = getQty(product.id)}
						{@const style = colorStyles[product.colorKey]}
						<div class="relative flex">
							<button
								type="button"
								onclick={() => posStore.addProduct(product.id)}
								class="group relative flex min-h-[104px] w-full flex-col justify-between rounded-2xl border-2 p-3.5 text-left transition-all duration-75 active:scale-[0.97] sm:min-h-[112px] sm:p-4 {style.cardBg} {qty >
								0
									? style.cardActive
									: 'shadow-lg'}"
							>
								<div class="flex w-full items-start justify-between gap-2">
									<div class="flex items-center gap-2">
										<span
											class="inline-flex items-center rounded-lg px-2 py-0.5 font-mono text-xs font-black uppercase tracking-wider {style.badgeBg}"
										>
											{product.badgeCode}
										</span>
										<span class="text-2xl leading-none" aria-hidden="true">{product.emoji}</span>
										<span class="text-xl font-black leading-tight tracking-tight sm:text-2xl">
											{product.shortName}
										</span>
									</div>

									{#if qty > 0}
										<span
											class="inline-flex h-9 min-w-[44px] items-center justify-center rounded-xl bg-slate-950 px-2 font-mono text-lg font-black text-emerald-400 ring-2 ring-emerald-400"
										>
											{qty}x
										</span>
									{/if}
								</div>

								<div class="mt-2 flex w-full items-center justify-between">
									<span
										class="inline-flex items-center rounded-xl px-3 py-1 font-mono text-lg font-black tracking-tight shadow-sm {style.pricePill}"
									>
										{formatCLP(product.price)}
									</span>

									<span
										class="inline-flex items-center gap-1 rounded-xl bg-black/20 px-2.5 py-1 text-xs font-black uppercase tracking-wider"
									>
										<Plus class="h-4 w-4 stroke-[3]" />
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
									class="absolute -bottom-2 -right-2 z-10 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white bg-rose-600 text-white shadow-lg transition hover:bg-rose-500 active:scale-90"
									title="Restar 1 {product.shortName}"
									aria-label="Restar 1 {product.shortName}"
								>
									<Minus class="h-5 w-5 stroke-[3]" />
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- ATAJOS DE COMBOS TÍPICOS DE LA VEGA (1 Solo Toque) -->
			<div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
				<div class="mb-2 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
					<Sparkles class="h-3.5 w-3.5" />
					<span>Combos Rápidos (1 Toque)</span>
				</div>
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
					<button
						type="button"
						onclick={() => addCombo(['emp-pabellon', 'beb-malta'])}
						class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2.5 text-left text-xs font-bold text-white transition hover:border-amber-400 hover:bg-slate-800 active:scale-95"
					>
						<span>1 Pabellón + 1 Malta</span>
						<span class="rounded-md bg-amber-400/20 px-2 py-0.5 font-mono font-black text-amber-300">
							$4.000
						</span>
					</button>
					<button
						type="button"
						onclick={() => addCombo(['emp-pabellon', 'emp-mechada', 'beb-malta'])}
						class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2.5 text-left text-xs font-bold text-white transition hover:border-amber-400 hover:bg-slate-800 active:scale-95"
					>
						<span>1 Pab + 1 Mec + Malta</span>
						<span class="rounded-md bg-amber-400/20 px-2 py-0.5 font-mono font-black text-amber-300">
							$6.500
						</span>
					</button>
					<button
						type="button"
						onclick={() => addCombo(['emp-queso', 'emp-queso', 'beb-lata'])}
						class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-2.5 text-left text-xs font-bold text-white transition hover:border-amber-400 hover:bg-slate-800 active:scale-95"
					>
						<span>2 Queso + 1 Bebida</span>
						<span class="rounded-md bg-amber-400/20 px-2 py-0.5 font-mono font-black text-amber-300">
							$5.200
						</span>
					</button>
				</div>
			</div>
		</section>

		<!-- ================================================================== -->
		<!-- ZONA DERECHA (5 COLUMNAS): EL "PAPEL" DIGITAL + VUELTO + COBRAR    -->
		<!-- ================================================================== -->
		<aside class="flex flex-col gap-3 lg:col-span-5 lg:sticky lg:top-20" aria-label="Papel del pedido actual y cobro">
			<!-- EL PAPEL DIGITAL (Estética Comanda / Block de Notas de Alto Contraste) -->
			<div class="overflow-hidden rounded-3xl border-4 border-amber-400/80 bg-paper-50 text-slate-950 shadow-2xl">
				<!-- Cabecera del Papel -->
				<div class="flex items-center justify-between border-b-2 border-dashed border-slate-300 bg-amber-100/80 px-4 py-3">
					<div class="flex items-center gap-2">
						<span
							class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 font-mono text-xs font-black text-amber-400"
						>
							<Pin class="h-4 w-4" />
						</span>
						<div>
							<h2 class="text-base font-black uppercase tracking-tight text-slate-950">
								Papel #{posStore.nextTicketNumber.toString().padStart(3, '0')}
							</h2>
							<p class="text-xs font-bold text-slate-600">
								{posStore.currentTotalUnits === 0
									? 'Esperando pedido...'
									: `${posStore.currentTotalUnits} ${posStore.currentTotalUnits === 1 ? 'producto anotado' : 'productos anotados'}`}
							</p>
						</div>
					</div>

					{#if posStore.orderItems.length > 0}
						<button
							type="button"
							onclick={() => posStore.clearCurrentOrder()}
							class="flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-rose-300 bg-rose-100 px-3 py-1.5 text-xs font-black uppercase text-rose-800 transition hover:bg-rose-200 active:scale-95"
							title="Limpiar todo el papel actual"
						>
							<Trash2 class="h-4 w-4 stroke-[2.5]" />
							<span>Limpiar</span>
						</button>
					{/if}
				</div>

				<!-- Cuerpo del Papel: Lista de productos tocados en tiempo real -->
				<div class="custom-scrollbar max-h-[260px] min-h-[165px] overflow-y-auto px-3 py-2.5 sm:px-4">
					{#if posStore.orderItems.length === 0}
						<div class="flex h-[150px] flex-col items-center justify-center text-center">
							<p class="text-lg font-black uppercase text-slate-400">Papel en blanco</p>
							<p class="mt-1 max-w-xs text-xs font-bold text-slate-500">
								Toca las empanadas o bebidas de la izquierda para anotarlas al instante.
							</p>
						</div>
					{:else}
						<ul class="divide-y-2 divide-dashed divide-slate-200">
							{#each posStore.orderItems as item (item.product.id)}
								{@const style = colorStyles[item.product.colorKey]}
								<li class="flex items-center justify-between gap-2 py-2.5">
									<div class="flex min-w-0 flex-1 items-center gap-2.5">
										<span class="h-9 w-2 shrink-0 rounded-full {style.accentBar}"></span>
										<div class="min-w-0">
											<div class="flex items-baseline gap-1.5">
												<span class="font-mono text-xl font-black text-slate-950">
													{item.quantity}x
												</span>
												<span class="truncate text-lg font-black text-slate-900">
													{item.product.shortName}
												</span>
											</div>
											<div class="font-mono text-xs font-bold text-slate-600">
												{formatCLP(item.product.price)} c/u
											</div>
										</div>
									</div>

									<!-- Subtotal de línea -->
									<div class="text-right font-mono text-lg font-black text-slate-950">
										{formatCLP(item.subtotal)}
									</div>

									<!-- Controles Táctiles Grandes (- / +) para corregir rápido -->
									<div class="flex shrink-0 items-center gap-1.5">
										<button
											type="button"
											onclick={() => posStore.decrementProduct(item.product.id)}
											class="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-rose-300 bg-rose-500 text-white shadow-sm transition hover:bg-rose-600 active:scale-90"
											aria-label="Restar 1 {item.product.shortName}"
										>
											<Minus class="h-5 w-5 stroke-[3]" />
										</button>
										<button
											type="button"
											onclick={() => posStore.addProduct(item.product.id)}
											class="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-emerald-300 bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-500 active:scale-90"
											aria-label="Sumar 1 {item.product.shortName}"
										>
											<Plus class="h-5 w-5 stroke-[3]" />
										</button>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<!-- ZONA DE TOTAL GIGANTE EN CLP -->
				<div class="border-t-2 border-slate-900 bg-slate-950 px-4 py-3.5 text-white">
					<div class="flex items-baseline justify-between">
						<span class="text-sm font-black uppercase tracking-wider text-amber-400">
							Total a Cobrar:
						</span>
						<span
							class="font-mono text-4xl font-black tracking-tight text-white tabular-nums sm:text-5xl"
						>
							{formatCLP(posStore.currentTotal)}
						</span>
					</div>
				</div>

				<!-- CALCULADORA DE VUELTO RÁPIDA (Billetes Chilenos de 1 Toque) -->
				<div class="border-t border-slate-800 bg-slate-900 px-4 py-3 text-white">
					<div class="mb-2 flex items-center justify-between">
						<div class="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-300">
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

					<!-- Botones de Billetes CLP -->
					<div class="grid grid-cols-4 gap-1.5">
						<button
							type="button"
							disabled={posStore.currentTotal === 0}
							onclick={() => posStore.setCashBill(posStore.currentTotal)}
							class="min-h-[44px] rounded-xl border-2 font-mono text-xs font-black uppercase transition active:scale-95 disabled:opacity-40 sm:text-sm {posStore.cashReceived >
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
								class="min-h-[44px] rounded-xl border-2 font-mono text-xs font-black transition active:scale-95 disabled:opacity-40 sm:text-sm {posStore.cashReceived ===
								bill
									? 'border-amber-400 bg-amber-400 text-slate-950'
									: 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'}"
							>
								{formatCLP(bill)}
							</button>
						{/each}
					</div>

					<!-- Botones para sumar billetes adicionales (+1.000 / +2.000 / +5.000) -->
					{#if posStore.currentTotal > 0}
						<div class="mt-1.5 grid grid-cols-3 gap-1.5">
							{#each [1000, 2000, 5000] as extraBill}
								<button
									type="button"
									onclick={() => posStore.setCashBill(extraBill, true)}
									class="min-h-[36px] rounded-lg border border-slate-700 bg-slate-800/70 font-mono text-xs font-bold text-slate-300 transition hover:bg-slate-700 active:scale-95"
								>
									+{formatCLP(extraBill)}
								</button>
							{/each}
						</div>
					{/if}

					<!-- Resultado del Vuelto en Grande -->
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
									<div>Paga con: <strong class="font-mono">{formatCLP(posStore.cashReceived)}</strong></div>
									<div class="uppercase tracking-wider">
										{posStore.changeAmount >= 0 ? 'Vuelto a entregar:' : 'Falta por cobrar:'}
									</div>
								</div>
							</div>
							<span class="font-mono text-2xl font-black tabular-nums sm:text-3xl">
								{formatCLP(Math.abs(posStore.changeAmount))}
							</span>
						</div>
					{/if}
				</div>

				<!-- BOTÓN DE ACCIÓN PRINCIPAL: "COBRAR / PINCHAR PAPEL" -->
				<div class="bg-slate-950 p-3.5">
					<button
						type="button"
						disabled={posStore.orderItems.length === 0}
						onclick={() => posStore.pincharPapel()}
						class="flex min-h-[78px] w-full items-center justify-center gap-3 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 to-emerald-400 px-5 py-4 text-slate-950 shadow-xl shadow-emerald-500/25 transition-all hover:from-emerald-400 hover:to-emerald-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-slate-800 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:shadow-none"
					>
						<Pin class="h-8 w-8 shrink-0 stroke-[2.75]" />
						<div class="flex flex-col items-start text-left leading-none">
							<span class="text-xl font-black uppercase tracking-tight sm:text-2xl">
								{posStore.orderItems.length === 0
									? 'Anota un Producto'
									: `Pinchar Papel • ${formatCLP(posStore.currentTotal)}`}
							</span>
							<span class="mt-1 text-xs font-extrabold uppercase tracking-wider opacity-85">
								{posStore.orderItems.length === 0
									? 'Toca los botones de colores para empezar'
									: 'Guarda la venta y limpia en 0 seg para el siguiente'}
							</span>
						</div>
					</button>
				</div>
			</div>
		</aside>
	</div>
</main>
