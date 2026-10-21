import type {
	DashboardMetrics,
	DailyComparisonPoint,
	HourlyBucket,
	OrderItem,
	Product,
	ProductMetricItem,
	SaleRecord
} from '$lib/types/pos';

const STORAGE_KEY_SALES = 'lavega_pos_ventas_v1';
const STORAGE_KEY_SEEDED = 'lavega_pos_seeded_date_v1';

/**
 * Catálogo oficial de productos fijos del local en La Vega.
 * Diseñado con códigos cortos y colores de alto contraste para memoria muscular.
 */
export const CATALOGO_PRODUCTOS: Product[] = [
	{
		id: 'emp-pabellon',
		name: 'Empanada Pabellón',
		shortName: 'Pabellón',
		subtitle: 'Mechada, caraotas, tajada y queso',
		category: 'empanada',
		price: 2500,
		colorKey: 'amber',
		badgeCode: 'PAB',
		emoji: '🥟'
	},
	{
		id: 'emp-mechada',
		name: 'Empanada Mechada',
		shortName: 'Mechada',
		subtitle: 'Carne desmechada criolla jugosa',
		category: 'empanada',
		price: 2500,
		colorKey: 'rose',
		badgeCode: 'MEC',
		emoji: '🥩'
	},
	{
		id: 'emp-queso',
		name: 'Empanada Queso',
		shortName: 'Queso',
		subtitle: 'Full queso llanero derretido',
		category: 'empanada',
		price: 2000,
		colorKey: 'yellow',
		badgeCode: 'QUE',
		emoji: '🧀'
	},
	{
		id: 'emp-domino',
		name: 'Empanada Dominó',
		shortName: 'Dominó',
		subtitle: 'Caraotas negras con queso blanco',
		category: 'empanada',
		price: 2200,
		colorKey: 'indigo',
		badgeCode: 'DOM',
		emoji: '🫘'
	},
	{
		id: 'beb-malta',
		name: 'Malta Venezolana',
		shortName: 'Malta',
		subtitle: 'Botella / Lata bien helada',
		category: 'bebida',
		price: 1500,
		colorKey: 'orange',
		badgeCode: 'MAL',
		emoji: '🍺'
	},
	{
		id: 'beb-lata',
		name: 'Bebida Lata',
		shortName: 'Bebida Lata',
		subtitle: 'Frescolita / Gaseosa 350ml',
		category: 'bebida',
		price: 1200,
		colorKey: 'cyan',
		badgeCode: 'BEB',
		emoji: '🥤'
	}
];

/**
 * Helper para obtener el inicio del día (00:00:00.000) de una fecha dada.
 */
function getStartOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

/**
 * Helper para obtener el lunes de la semana correspondiente a una fecha.
 */
function getMondayOfWeek(date: Date): Date {
	const d = getStartOfDay(date);
	const day = d.getDay(); // 0 = Domingo, 1 = Lunes, ...
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d;
}

/**
 * Genera datos de prueba pre-cargados realistas para un puesto en La Vega Central.
 * Incluye ventas de la semana pasada, días previos de esta semana y ventas del día de hoy
 * distribuidas por horas pico (08:00 a hora actual) para probar el Dashboard de inmediato.
 */
export function generarDatosSemillaLaVega(now: Date = new Date()): SaleRecord[] {
	const sales: SaleRecord[] = [];
	const pMap = new Map(CATALOGO_PRODUCTOS.map((p) => [p.id, p]));

	const createTicket = (
		dateObj: Date,
		ticketNum: number,
		recipe: Array<{ id: string; qty: number }>,
		cashPaid?: number
	): SaleRecord => {
		const items = recipe.map(({ id, qty }) => {
			const prod = pMap.get(id)!;
			return {
				productId: prod.id,
				name: prod.name,
				shortName: prod.shortName,
				category: prod.category,
				quantity: qty,
				unitPrice: prod.price,
				subtotal: prod.price * qty
			};
		});
		const total = items.reduce((acc, it) => acc + it.subtotal, 0);
		return {
			id: `seed-${dateObj.getTime()}-${ticketNum}`,
			ticketNumber: ticketNum,
			createdAt: dateObj.toISOString(),
			items,
			total,
			cashReceived: cashPaid ?? total,
			changeGiven: cashPaid ? Math.max(0, cashPaid - total) : 0,
			syncedWithSupabase: false
		};
	};

	// Patrones realistas de pedidos en La Vega (Pabellón y Mechada lideran, seguidos de Queso y Malta)
	const combos: Array<Array<{ id: string; qty: number }>> = [
		[
			{ id: 'emp-pabellon', qty: 2 },
			{ id: 'beb-malta', qty: 1 }
		], // $6.500
		[
			{ id: 'emp-pabellon', qty: 1 },
			{ id: 'emp-mechada', qty: 2 },
			{ id: 'beb-malta', qty: 1 }
		], // $9.000
		[
			{ id: 'emp-queso', qty: 2 },
			{ id: 'beb-lata', qty: 2 }
		], // $6.400
		[
			{ id: 'emp-pabellon', qty: 1 },
			{ id: 'beb-malta', qty: 1 }
		], // $4.000
		[
			{ id: 'emp-mechada', qty: 1 },
			{ id: 'emp-domino', qty: 1 },
			{ id: 'beb-lata', qty: 1 }
		], // $5.900
		[
			{ id: 'emp-pabellon', qty: 3 },
			{ id: 'emp-queso', qty: 2 },
			{ id: 'beb-malta', qty: 3 }
		], // $16.000 (familia)
		[
			{ id: 'emp-pabellon', qty: 1 },
			{ id: 'emp-queso', qty: 1 }
		], // $4.500
		[
			{ id: 'emp-domino', qty: 2 },
			{ id: 'beb-malta', qty: 1 }
		], // $5.900
		[
			{ id: 'emp-mechada', qty: 2 },
			{ id: 'beb-lata', qty: 1 }
		], // $6.200
		[
			{ id: 'emp-pabellon', qty: 2 },
			{ id: 'emp-mechada', qty: 1 },
			{ id: 'beb-malta', qty: 2 }
		] // $10.500
	];

	const mondayThisWeek = getMondayOfWeek(now);
	const mondayPrevWeek = new Date(mondayThisWeek);
	mondayPrevWeek.setDate(mondayPrevWeek.getDate() - 7);

	// 1. Ventas de los 7 días de la Semana Anterior (Lun a Dom)
	const prevWeekDailyTicketCounts = [22, 24, 26, 25, 30, 38, 34];
	for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
		const dayDate = new Date(mondayPrevWeek);
		dayDate.setDate(dayDate.getDate() + dayOffset);
		const count = prevWeekDailyTicketCounts[dayOffset];

		for (let t = 0; t < count; t++) {
			const ticketTime = new Date(dayDate);
			const hour = 8 + (t % 8);
			const minute = (t * 7) % 60;
			ticketTime.setHours(hour, minute, 0, 0);
			const combo = combos[(t + dayOffset) % combos.length];
			sales.push(createTicket(ticketTime, t + 1, combo));
		}
	}

	// 2. Ventas de los días anteriores de ESTA Semana (desde el Lunes hasta Ayer)
	const todayStart = getStartOfDay(now);
	const daysElapsedThisWeek = Math.max(
		0,
		Math.round((todayStart.getTime() - mondayThisWeek.getTime()) / (1000 * 60 * 60 * 24))
	);
	const currentWeekDailyCounts = [27, 29, 31, 30, 36, 44, 40];

	for (let dayOffset = 0; dayOffset < daysElapsedThisWeek; dayOffset++) {
		const dayDate = new Date(mondayThisWeek);
		dayDate.setDate(dayDate.getDate() + dayOffset);
		const count = currentWeekDailyCounts[dayOffset] ?? 28;

		for (let t = 0; t < count; t++) {
			const ticketTime = new Date(dayDate);
			const hour = 8 + (t % 8);
			const minute = (t * 11) % 60;
			ticketTime.setHours(hour, minute, 0, 0);
			const combo = combos[(t * 2 + dayOffset) % combos.length];
			sales.push(createTicket(ticketTime, t + 1, combo));
		}
	}

	// 3. Ventas de HOY distribuidas por horas para mostrar la curva de Horas Pico en La Vega
	// Distribución por hora (07:00 a 16:00) con pico marcado entre las 11:00 y 13:00 hrs
	const hourlyScheduleToday: Array<{ hour: number; ticketsCount: number }> = [
		{ hour: 7, ticketsCount: 2 },
		{ hour: 8, ticketsCount: 4 },
		{ hour: 9, ticketsCount: 6 },
		{ hour: 10, ticketsCount: 8 },
		{ hour: 11, ticketsCount: 11 }, // Inicio hora pico desayuno tardío / almuerzo temprano
		{ hour: 12, ticketsCount: 9 },
		{ hour: 13, ticketsCount: 7 },
		{ hour: 14, ticketsCount: 4 }
	];

	let todayTicketCounter = 1;
	for (const slot of hourlyScheduleToday) {
		for (let i = 0; i < slot.ticketsCount; i++) {
			const ticketTime = new Date(todayStart);
			const minute = Math.min(58, i * 5 + 4);
			ticketTime.setHours(slot.hour, minute, 15, 0);

			const combo = combos[(todayTicketCounter + slot.hour) % combos.length];
			const tempTotal = combo.reduce((sum, item) => {
				const p = pMap.get(item.id)!;
				return sum + p.price * item.qty;
			}, 0);
			const cashPaid = tempTotal <= 5000 ? 5000 : tempTotal <= 10000 ? 10000 : 20000;

			sales.push(createTicket(ticketTime, todayTicketCounter, combo, cashPaid));
			todayTicketCounter++;
		}
	}

	// Ordenar cronológicamente (más recientes al final)
	return sales.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Carga el historial de ventas desde localStorage o inicializa los datos semilla
 * si es la primera vez que se abre hoy.
 */
export function cargarVentasIniciales(): SaleRecord[] {
	if (typeof window === 'undefined') {
		return generarDatosSemillaLaVega();
	}

	try {
		const todayKey = getStartOfDay(new Date()).toISOString().slice(0, 10);
		const seededDate = localStorage.getItem(STORAGE_KEY_SEEDED);
		const rawSales = localStorage.getItem(STORAGE_KEY_SALES);

		if (rawSales && seededDate === todayKey) {
			const parsed = JSON.parse(rawSales) as SaleRecord[];
			if (Array.isArray(parsed) && parsed.length > 0) {
				return parsed;
			}
		}

		// Inicializar con datos semilla actualizados al día de hoy
		const seeded = generarDatosSemillaLaVega(new Date());
		localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(seeded));
		localStorage.setItem(STORAGE_KEY_SEEDED, todayKey);
		return seeded;
	} catch {
		return generarDatosSemillaLaVega();
	}
}

/**
 * Persiste el arreglo completo de ventas en localStorage.
 */
export function guardarVentasEnStorage(sales: SaleRecord[]): void {
	if (typeof window === 'undefined') return;
	try {
		const todayKey = getStartOfDay(new Date()).toISOString().slice(0, 10);
		localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(sales));
		localStorage.setItem(STORAGE_KEY_SEEDED, todayKey);
	} catch (err) {
		console.error('Error guardando ventas en localStorage:', err);
	}
}

/**
 * ============================================================================
 * CAPA DE SERVICIO LISTA PARA SUPABASE (Punto de inyección para Backend/Claude)
 * ============================================================================
 * Registra una nueva venta ("Pinchar Papel").
 * Actualmente guarda en estado local + localStorage en 0ms.
 * Cuando se conecte Supabase, basta con descomentar el bloque async de inserción.
 */
export async function registrarVenta(params: {
	items: OrderItem[];
	nextTicketNumber: number;
	cashReceived?: number;
}): Promise<SaleRecord> {
	const now = new Date();
	const saleItems = params.items.map((item) => ({
		productId: item.product.id,
		name: item.product.name,
		shortName: item.product.shortName,
		category: item.product.category,
		quantity: item.quantity,
		unitPrice: item.product.price,
		subtotal: item.subtotal
	}));

	const total = saleItems.reduce((sum, it) => sum + it.subtotal, 0);
	const cashReceived =
		params.cashReceived && params.cashReceived >= total ? params.cashReceived : total;
	const changeGiven = Math.max(0, cashReceived - total);

	const newSale: SaleRecord = {
		id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sale-${Date.now()}`,
		ticketNumber: params.nextTicketNumber,
		createdAt: now.toISOString(),
		items: saleItems,
		total,
		cashReceived,
		changeGiven,
		syncedWithSupabase: false
	};

	/*
	 * TODO [SUPABASE INTEGRATION - CLAUDE]:
	 * Inyectar cliente Supabase aquí sin bloquear la UI (Optimistic UI):
	 *
	 * const { data, error } = await supabase
	 *   .from('ventas')
	 *   .insert({
	 *     id: newSale.id,
	 *     ticket_number: newSale.ticketNumber,
	 *     created_at: newSale.createdAt,
	 *     total_clp: newSale.total,
	 *     efectivo_recibido: newSale.cashReceived,
	 *     vuelto_clp: newSale.changeGiven
	 *   })
	 *   .select()
	 *   .single();
	 *
	 * if (!error) {
	 *   await supabase.from('detalle_ventas').insert(
	 *     newSale.items.map((item) => ({
	 *       venta_id: newSale.id,
	 *       producto_id: item.productId,
	 *       nombre_producto: item.name,
	 *       categoria: item.category,
	 *       cantidad: item.quantity,
	 *       precio_unitario: item.unitPrice,
	 *       subtotal: item.subtotal
	 *     }))
	 *   );
	 *   newSale.syncedWithSupabase = true;
	 * }
	 */

	return newSale;
}

/**
 * ============================================================================
 * CAPA DE SERVICIO LISTA PARA SUPABASE: Cálculo de Cierre de Caja y Métricas
 * ============================================================================
 * Procesa los registros de ventas y retorna todas las métricas listas para la Vista 2:
 * 1. Cierre de Caja (Hoy)
 * 2. Producto Estrella (Hoy y Esta Semana)
 * 3. Flujo por Hora (Horas Pico de 07:00 a 18:00)
 * 4. Comparativa Semanal (Esta Semana vs Semana Anterior)
 */
export function obtenerMetricas(
	sales: SaleRecord[],
	catalog: Product[] = CATALOGO_PRODUCTOS,
	referenceDate: Date = new Date()
): DashboardMetrics {
	const todayStart = getStartOfDay(referenceDate);
	const tomorrowStart = new Date(todayStart);
	tomorrowStart.setDate(tomorrowStart.getDate() + 1);

	const mondayThisWeek = getMondayOfWeek(referenceDate);
	const nextMonday = new Date(mondayThisWeek);
	nextMonday.setDate(nextMonday.getDate() + 7);

	const mondayPrevWeek = new Date(mondayThisWeek);
	mondayPrevWeek.setDate(mondayPrevWeek.getDate() - 7);

	// Filtrar ventas por rango temporal
	const todaySales = sales.filter((s) => {
		const t = new Date(s.createdAt).getTime();
		return t >= todayStart.getTime() && t < tomorrowStart.getTime();
	});

	const thisWeekSales = sales.filter((s) => {
		const t = new Date(s.createdAt).getTime();
		return t >= mondayThisWeek.getTime() && t < nextMonday.getTime();
	});

	const prevWeekSales = sales.filter((s) => {
		const t = new Date(s.createdAt).getTime();
		return t >= mondayPrevWeek.getTime() && t < mondayThisWeek.getTime();
	});

	// 1. Métricas de Cierre de Caja (Hoy)
	const todayTotal = todaySales.reduce((acc, s) => acc + s.total, 0);
	const todayTicketsCount = todaySales.length;
	const todayAverageTicket = todayTicketsCount > 0 ? Math.round(todayTotal / todayTicketsCount) : 0;

	let todayTotalUnits = 0;
	let todayEmpanadasCount = 0;
	let todayBebidasCount = 0;

	for (const sale of todaySales) {
		for (const item of sale.items) {
			todayTotalUnits += item.quantity;
			if (item.category === 'empanada') todayEmpanadasCount += item.quantity;
			else if (item.category === 'bebida') todayBebidasCount += item.quantity;
		}
	}

	// Helper para construir ranking de productos en un período
	const buildProductRanking = (periodSales: SaleRecord[]): ProductMetricItem[] => {
		const map = new Map<string, { units: number; revenue: number }>();
		for (const prod of catalog) {
			map.set(prod.id, { units: 0, revenue: 0 });
		}

		let totalUnitsPeriod = 0;
		let totalRevenuePeriod = 0;

		for (const sale of periodSales) {
			for (const item of sale.items) {
				const current = map.get(item.productId) ?? { units: 0, revenue: 0 };
				current.units += item.quantity;
				current.revenue += item.subtotal;
				map.set(item.productId, current);
				totalUnitsPeriod += item.quantity;
				totalRevenuePeriod += item.subtotal;
			}
		}

		return catalog
			.map((prod) => {
				const stats = map.get(prod.id) ?? { units: 0, revenue: 0 };
				return {
					productId: prod.id,
					name: prod.name,
					shortName: prod.shortName,
					emoji: prod.emoji,
					category: prod.category,
					colorKey: prod.colorKey,
					units: stats.units,
					revenue: stats.revenue,
					sharePercent: totalUnitsPeriod > 0 ? Math.round((stats.units / totalUnitsPeriod) * 100) : 0,
					revenuePercent:
						totalRevenuePeriod > 0 ? Math.round((stats.revenue / totalRevenuePeriod) * 100) : 0
				};
			})
			.sort((a, b) => b.units - a.units || b.revenue - a.revenue);
	};

	const productRankingToday = buildProductRanking(todaySales);
	const productRankingWeek = buildProductRanking(thisWeekSales);

	const starProductToday =
		productRankingToday.length > 0 && productRankingToday[0].units > 0
			? productRankingToday[0]
			: null;
	const starProductWeek =
		productRankingWeek.length > 0 && productRankingWeek[0].units > 0
			? productRankingWeek[0]
			: null;

	// 3. Flujo por Hora (Horario La Vega: 07:00 a 17:00 hrs)
	const startHour = 7;
	const endHour = 17;
	const rawHourly: HourlyBucket[] = [];

	for (let h = startHour; h <= endHour; h++) {
		rawHourly.push({
			hour: h,
			label: `${h.toString().padStart(2, '0')}:00`,
			shortLabel: `${h}h`,
			tickets: 0,
			revenue: 0,
			empanadasUnits: 0,
			intensityPercent: 0,
			isPeak: false
		});
	}

	for (const sale of todaySales) {
		const saleDate = new Date(sale.createdAt);
		const h = saleDate.getHours();
		const bucket = rawHourly.find((b) => b.hour === h);
		if (bucket) {
			bucket.tickets += 1;
			bucket.revenue += sale.total;
			bucket.empanadasUnits += sale.items
				.filter((i) => i.category === 'empanada')
				.reduce((acc, i) => acc + i.quantity, 0);
		}
	}

	const maxHourlyRevenue = Math.max(...rawHourly.map((b) => b.revenue), 0);
	let peakHour: HourlyBucket | null = null;

	for (const bucket of rawHourly) {
		bucket.intensityPercent =
			maxHourlyRevenue > 0 ? Math.round((bucket.revenue / maxHourlyRevenue) * 100) : 0;
		if (maxHourlyRevenue > 0 && bucket.revenue === maxHourlyRevenue && !peakHour) {
			bucket.isPeak = true;
			peakHour = bucket;
		}
	}

	// 4. Comparativa Semanal (Esta Semana vs Semana Anterior)
	const currentWeekTotal = thisWeekSales.reduce((acc, s) => acc + s.total, 0);
	const previousWeekTotal = prevWeekSales.reduce((acc, s) => acc + s.total, 0);
	const currentWeekTickets = thisWeekSales.length;
	const previousWeekTickets = prevWeekSales.length;

	const deltaAmount = currentWeekTotal - previousWeekTotal;
	const deltaPercent =
		previousWeekTotal > 0
			? Number((((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100).toFixed(1))
			: currentWeekTotal > 0
				? 100
				: 0;

	const trend: 'up' | 'down' | 'neutral' =
		deltaAmount > 0 ? 'up' : deltaAmount < 0 ? 'down' : 'neutral';

	const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
	const fullDayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

	const dailyBreakdown: DailyComparisonPoint[] = dayNames.map((dayName, idx) => {
		const currDayStart = new Date(mondayThisWeek);
		currDayStart.setDate(currDayStart.getDate() + idx);
		const currDayEnd = new Date(currDayStart);
		currDayEnd.setDate(currDayEnd.getDate() + 1);

		const prevDayStart = new Date(mondayPrevWeek);
		prevDayStart.setDate(prevDayStart.getDate() + idx);
		const prevDayEnd = new Date(prevDayStart);
		prevDayEnd.setDate(prevDayEnd.getDate() + 1);

		const currDaySales = thisWeekSales.filter((s) => {
			const t = new Date(s.createdAt).getTime();
			return t >= currDayStart.getTime() && t < currDayEnd.getTime();
		});

		const prevDaySales = prevWeekSales.filter((s) => {
			const t = new Date(s.createdAt).getTime();
			return t >= prevDayStart.getTime() && t < prevDayEnd.getTime();
		});

		return {
			dayName,
			fullDayName: fullDayNames[idx],
			currentWeekRevenue: currDaySales.reduce((acc, s) => acc + s.total, 0),
			previousWeekRevenue: prevDaySales.reduce((acc, s) => acc + s.total, 0),
			currentWeekTickets: currDaySales.length,
			isToday: currDayStart.getTime() === todayStart.getTime(),
			isFutureDay: currDayStart.getTime() > todayStart.getTime()
		};
	});

	return {
		todayTotal,
		todayTicketsCount,
		todayAverageTicket,
		todayTotalUnits,
		todayEmpanadasCount,
		todayBebidasCount,
		starProductToday,
		starProductWeek,
		productRankingToday,
		productRankingWeek,
		hourlyFlow: rawHourly,
		peakHour,
		weeklyComparison: {
			currentWeekTotal,
			previousWeekTotal,
			currentWeekTickets,
			previousWeekTickets,
			deltaAmount,
			deltaPercent,
			trend,
			dailyBreakdown
		}
	};
}
