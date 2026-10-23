import type {
	DashboardMetrics,
	DailyComparisonPoint,
	HourlyBucket,
	OrderItem,
	Product,
	ProductMetricItem,
	SaleRecord
} from '$lib/types/pos';

const STORAGE_KEY_SALES = 'lavega_pos_ventas_v2';
const STORAGE_KEY_SEEDED = 'lavega_pos_seeded_date_v2';

/**
 * Catálogo oficial completo de productos del local en La Vega (46 productos).
 * Tipado estricto con categorías ('empanada' | 'arepa' | 'bebida') y subcategorías
 * para navegación táctil ultrarrápida y libre de errores de cobro.
 */
export const CATALOGO_PRODUCTOS: Product[] = [
	// ========================================================================
	// A. CATEGORÍA: EMPANADAS — TRADICIONALES ($1.000 c/u)
	// ========================================================================
	{
		id: 'emp-mechada',
		name: 'Empanada Mechada',
		shortName: 'Mechada',
		subtitle: 'Carne desmechada criolla',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'rose',
		badgeCode: 'MEC',
		emoji: '🥩'
	},
	{
		id: 'emp-mechada-queso',
		name: 'Empanada Mechada Queso',
		shortName: 'Mechada Queso',
		subtitle: 'Carne mechada con queso llanero',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'rose',
		badgeCode: 'M+Q',
		emoji: '🧀'
	},
	{
		id: 'emp-pollo',
		name: 'Empanada Pollo',
		shortName: 'Pollo',
		subtitle: 'Pollo guisado desmechado',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'amber',
		badgeCode: 'POL',
		emoji: '🍗'
	},
	{
		id: 'emp-pollo-queso',
		name: 'Empanada Pollo Queso',
		shortName: 'Pollo Queso',
		subtitle: 'Pollo desmechado con queso',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'amber',
		badgeCode: 'P+Q',
		emoji: '🧀'
	},
	{
		id: 'emp-pabellon',
		name: 'Empanada Pabellón',
		shortName: 'Pabellón',
		subtitle: 'Mechada, caraotas, tajada y queso',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'amber',
		badgeCode: 'PAB',
		emoji: '🥟'
	},
	{
		id: 'emp-cordon-bleu',
		name: 'Empanada Cordon Bleu',
		shortName: 'Cordon Bleu',
		subtitle: 'Pollo, jamón y queso fundido',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'orange',
		badgeCode: 'CBL',
		emoji: '🥓'
	},
	{
		id: 'emp-molida',
		name: 'Empanada Molida',
		shortName: 'Molida',
		subtitle: 'Carne molida sazonada',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'rose',
		badgeCode: 'MOL',
		emoji: '🥟'
	},
	{
		id: 'emp-molida-queso',
		name: 'Empanada Molida Queso',
		shortName: 'Molida Queso',
		subtitle: 'Carne molida con queso',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'rose',
		badgeCode: 'MOQ',
		emoji: '🧀'
	},
	{
		id: 'emp-tocino-queso',
		name: 'Empanada Tocino Queso',
		shortName: 'Tocino Queso',
		subtitle: 'Tocino ahumado y queso',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'orange',
		badgeCode: 'T+Q',
		emoji: '🥓'
	},
	{
		id: 'emp-domino',
		name: 'Empanada Dominó',
		shortName: 'Dominó',
		subtitle: 'Caraotas negras con queso blanco',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'indigo',
		badgeCode: 'DOM',
		emoji: '🫘'
	},
	{
		id: 'emp-queso-llanero',
		name: 'Empanada Queso Llanero',
		shortName: 'Queso Llanero',
		subtitle: 'Full queso llanero venezolano',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'yellow',
		badgeCode: 'QLL',
		emoji: '🧀'
	},
	{
		id: 'emp-platano-queso',
		name: 'Empanada Plátano Queso',
		shortName: 'Plátano Queso',
		subtitle: 'Tajada de plátano maduro y queso',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'yellow',
		badgeCode: 'PLQ',
		emoji: '🍌'
	},
	{
		id: 'emp-chorizo-queso',
		name: 'Empanada Chorizo Queso',
		shortName: 'Chorizo Queso',
		subtitle: 'Chorizo parrillero con queso',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'orange',
		badgeCode: 'CHQ',
		emoji: '🌭'
	},
	{
		id: 'emp-jamon-queso',
		name: 'Empanada Jamón Queso',
		shortName: 'Jamón Queso',
		subtitle: 'Clásica de jamón y queso derretido',
		category: 'empanada',
		subcategory: 'tradicional',
		price: 1000,
		colorKey: 'yellow',
		badgeCode: 'J+Q',
		emoji: '🥪'
	},

	// ========================================================================
	// A.2 CATEGORÍA: EMPANADAS — ESPECIALES ($2.000 - $3.000)
	// ========================================================================
	{
		id: 'emp-trifasica',
		name: 'Empanada Trifásica',
		shortName: 'Trifásica',
		subtitle: 'Especial 3 carnes + queso',
		category: 'empanada',
		subcategory: 'especial',
		price: 2000,
		colorKey: 'indigo',
		badgeCode: 'ESP $2.000',
		emoji: '⭐'
	},
	{
		id: 'emp-cazon',
		name: 'Empanada Cazón',
		shortName: 'Cazón',
		subtitle: 'Especial pescado cazón oriental',
		category: 'empanada',
		subcategory: 'especial',
		price: 2500,
		colorKey: 'cyan',
		badgeCode: 'ESP $2.500',
		emoji: '🦈'
	},
	{
		id: 'emp-naiguatarena',
		name: 'Empanada Naiguatareña',
		shortName: 'Naiguatareña',
		subtitle: 'Super especial de la costa',
		category: 'empanada',
		subcategory: 'especial',
		price: 3000,
		colorKey: 'rose',
		badgeCode: 'ESP $3.000',
		emoji: '👑'
	},

	// ========================================================================
	// B. CATEGORÍA: AREPAS ($2.000 - $5.000)
	// ========================================================================
	{
		id: 'are-desayuno-criollo',
		name: 'Desayuno Criollo',
		shortName: 'Desayuno Criollo',
		subtitle: 'Arepa, carne, caraotas, huevo y queso',
		category: 'arepa',
		subcategory: 'arepa',
		price: 5000,
		colorKey: 'amber',
		badgeCode: 'CRI',
		emoji: '🍳'
	},
	{
		id: 'are-pabellon',
		name: 'Arepa Pabellón',
		shortName: 'Arepa Pabellón',
		subtitle: 'Mechada, caraotas, tajada y queso',
		category: 'arepa',
		subcategory: 'arepa',
		price: 4500,
		colorKey: 'rose',
		badgeCode: 'PAB',
		emoji: '🫓'
	},
	{
		id: 'are-pelua',
		name: 'Arepa Pelúa',
		shortName: 'Arepa Pelúa',
		subtitle: 'Carne mechada y queso amarillo rallado',
		category: 'arepa',
		subcategory: 'arepa',
		price: 4000,
		colorKey: 'orange',
		badgeCode: 'PEL',
		emoji: '🥩'
	},
	{
		id: 'are-catira',
		name: 'Arepa Catira',
		shortName: 'Arepa Catira',
		subtitle: 'Pollo desmechado y queso amarillo',
		category: 'arepa',
		subcategory: 'arepa',
		price: 4000,
		colorKey: 'yellow',
		badgeCode: 'CAT',
		emoji: '🍗'
	},
	{
		id: 'are-reina-pepiada',
		name: 'Arepa Reina Pepiada',
		shortName: 'Reina Pepiada',
		subtitle: 'Pollo, palta cremosa y mayonesa',
		category: 'arepa',
		subcategory: 'arepa',
		price: 4000,
		colorKey: 'emerald',
		badgeCode: 'REI',
		emoji: '🥑'
	},
	{
		id: 'are-huevos-revueltos',
		name: 'Arepa de Huevos Revueltos',
		shortName: 'Huevos Revueltos',
		subtitle: 'Perico venezolano con tomate y cebollín',
		category: 'arepa',
		subcategory: 'arepa',
		price: 4000,
		colorKey: 'amber',
		badgeCode: 'HUE',
		emoji: '🥚'
	},
	{
		id: 'are-jamon-queso',
		name: 'Arepa Jamón Queso',
		shortName: 'Arepa Jamón Queso',
		subtitle: 'Jamón seleccionado y abundante queso',
		category: 'arepa',
		subcategory: 'arepa',
		price: 3500,
		colorKey: 'yellow',
		badgeCode: 'J+Q',
		emoji: '🧀'
	},
	{
		id: 'are-queso-llanero',
		name: 'Arepa Queso Llanero',
		shortName: 'Arepa Queso Llanero',
		subtitle: 'Rellena de queso llanero tradicional',
		category: 'arepa',
		subcategory: 'arepa',
		price: 3500,
		colorKey: 'yellow',
		badgeCode: 'QLL',
		emoji: '🧀'
	},
	{
		id: 'are-dulces',
		name: 'Arepitas Dulces',
		shortName: 'Arepitas Dulces',
		subtitle: 'Con papelón y toque de anís',
		category: 'arepa',
		subcategory: 'arepa',
		price: 2000,
		colorKey: 'orange',
		badgeCode: 'DUL',
		emoji: '🍯'
	},

	// ========================================================================
	// C.1 CATEGORÍA: BEBIDAS — GASEOSAS Y TRADICIONALES ($1.500 - $2.000)
	// ========================================================================
	{
		id: 'beb-malta',
		name: 'Malta',
		shortName: 'Malta',
		subtitle: 'Tradicional venezolana bien helada',
		category: 'bebida',
		subcategory: 'refresco',
		price: 2000,
		colorKey: 'orange',
		badgeCode: 'MAL',
		emoji: '🍺'
	},
	{
		id: 'beb-frescolita',
		name: 'Frescolita',
		shortName: 'Frescolita',
		subtitle: 'Refresco venezolano original',
		category: 'bebida',
		subcategory: 'refresco',
		price: 2000,
		colorKey: 'rose',
		badgeCode: 'FRE',
		emoji: '🥤'
	},
	{
		id: 'beb-papelon',
		name: 'Papelón',
		shortName: 'Papelón',
		subtitle: 'Papelón con limón helado',
		category: 'bebida',
		subcategory: 'refresco',
		price: 2000,
		colorKey: 'amber',
		badgeCode: 'PAP',
		emoji: '🍋'
	},
	{
		id: 'beb-coca-original',
		name: 'Coca-Cola Original',
		shortName: 'Coca-Cola Original',
		subtitle: 'Formato individual 350ml',
		category: 'bebida',
		subcategory: 'refresco',
		price: 1500,
		colorKey: 'rose',
		badgeCode: 'COC',
		emoji: '🥤'
	},
	{
		id: 'beb-coca-zero',
		name: 'Coca-Cola Zero',
		shortName: 'Coca-Cola Zero',
		subtitle: 'Sin azúcar 350ml',
		category: 'bebida',
		subcategory: 'refresco',
		price: 1500,
		colorKey: 'indigo',
		badgeCode: 'ZER',
		emoji: '🥤'
	},
	{
		id: 'beb-coca-doble-zero',
		name: 'Coca-Cola Doble Zero',
		shortName: 'Coca Doble Zero',
		subtitle: 'Sin azúcar ni cafeína',
		category: 'bebida',
		subcategory: 'refresco',
		price: 1500,
		colorKey: 'amber',
		badgeCode: '00Z',
		emoji: '🥤'
	},
	{
		id: 'beb-sprite',
		name: 'Sprite',
		shortName: 'Sprite',
		subtitle: 'Lima-limón bien helada',
		category: 'bebida',
		subcategory: 'refresco',
		price: 1500,
		colorKey: 'emerald',
		badgeCode: 'SPR',
		emoji: '🫧'
	},
	{
		id: 'beb-fanta',
		name: 'Fanta',
		shortName: 'Fanta',
		subtitle: 'Sabor naranja helada',
		category: 'bebida',
		subcategory: 'refresco',
		price: 1500,
		colorKey: 'orange',
		badgeCode: 'FAN',
		emoji: '🍊'
	},

	// ========================================================================
	// C.2 CATEGORÍA: BEBIDAS — FORMATOS GRANDES ($2.500 - $4.500)
	// ========================================================================
	{
		id: 'beb-papelon-grande',
		name: 'Papelón Grande',
		shortName: 'Papelón Grande',
		subtitle: 'Formato familiar / litro helado',
		category: 'bebida',
		subcategory: 'grande',
		price: 4500,
		colorKey: 'amber',
		badgeCode: 'GRANDE',
		emoji: '🫗'
	},
	{
		id: 'beb-coca-grande',
		name: 'Coca-Cola Grande',
		shortName: 'Coca-Cola Grande',
		subtitle: 'Formato grande para compartir',
		category: 'bebida',
		subcategory: 'grande',
		price: 2500,
		colorKey: 'rose',
		badgeCode: 'GRANDE',
		emoji: '🍾'
	},

	// ========================================================================
	// C.3 CATEGORÍA: BEBIDAS — JUGOS NATURALES ($2.000 c/u)
	// ========================================================================
	{
		id: 'jug-guanabana',
		name: 'Jugo Guanábana',
		shortName: 'Jugo Guanábana',
		subtitle: 'Jugo natural 100% fruta',
		category: 'bebida',
		subcategory: 'jugo',
		price: 2000,
		colorKey: 'emerald',
		badgeCode: 'JUG',
		emoji: '🍈'
	},
	{
		id: 'jug-guayaba',
		name: 'Jugo Guayaba',
		shortName: 'Jugo Guayaba',
		subtitle: 'Jugo natural 100% fruta',
		category: 'bebida',
		subcategory: 'jugo',
		price: 2000,
		colorKey: 'rose',
		badgeCode: 'JUG',
		emoji: '🩷'
	},
	{
		id: 'jug-tamarindo',
		name: 'Jugo Tamarindo',
		shortName: 'Jugo Tamarindo',
		subtitle: 'Jugo natural 100% fruta',
		category: 'bebida',
		subcategory: 'jugo',
		price: 2000,
		colorKey: 'amber',
		badgeCode: 'JUG',
		emoji: '🤎'
	},
	{
		id: 'jug-mora',
		name: 'Jugo Mora',
		shortName: 'Jugo Mora',
		subtitle: 'Jugo natural 100% fruta',
		category: 'bebida',
		subcategory: 'jugo',
		price: 2000,
		colorKey: 'indigo',
		badgeCode: 'JUG',
		emoji: '🫐'
	},
	{
		id: 'jug-maracuya',
		name: 'Jugo Maracuyá',
		shortName: 'Jugo Maracuyá',
		subtitle: 'Jugo natural 100% fruta',
		category: 'bebida',
		subcategory: 'jugo',
		price: 2000,
		colorKey: 'yellow',
		badgeCode: 'JUG',
		emoji: '💛'
	},
	{
		id: 'jug-pina',
		name: 'Jugo Piña',
		shortName: 'Jugo Piña',
		subtitle: 'Jugo natural 100% fruta',
		category: 'bebida',
		subcategory: 'jugo',
		price: 2000,
		colorKey: 'yellow',
		badgeCode: 'JUG',
		emoji: '🍍'
	},
	{
		id: 'jug-mango',
		name: 'Jugo Mango',
		shortName: 'Jugo Mango',
		subtitle: 'Jugo natural 100% fruta',
		category: 'bebida',
		subcategory: 'jugo',
		price: 2000,
		colorKey: 'orange',
		badgeCode: 'JUG',
		emoji: '🥭'
	},
	{
		id: 'jug-frutilla',
		name: 'Jugo Frutilla',
		shortName: 'Jugo Frutilla',
		subtitle: 'Jugo natural 100% fruta',
		category: 'bebida',
		subcategory: 'jugo',
		price: 2000,
		colorKey: 'rose',
		badgeCode: 'JUG',
		emoji: '🍓'
	},
	{
		id: 'jug-mandarina',
		name: 'Jugo Mandarina',
		shortName: 'Jugo Mandarina',
		subtitle: 'Jugo natural 100% fruta',
		category: 'bebida',
		subcategory: 'jugo',
		price: 2000,
		colorKey: 'orange',
		badgeCode: 'JUG',
		emoji: '🍊'
	},
	{
		id: 'jug-papaya',
		name: 'Jugo Papaya',
		shortName: 'Jugo Papaya',
		subtitle: 'Jugo natural 100% fruta',
		category: 'bebida',
		subcategory: 'jugo',
		price: 2000,
		colorKey: 'amber',
		badgeCode: 'JUG',
		emoji: '🧡'
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
 * Genera datos de prueba pre-cargados realistas para el puesto en La Vega Central,
 * sincronizados con el nuevo menú completo de 46 productos (Empanadas, Arepas y Bebidas).
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
		const items = recipe
			.map(({ id, qty }) => {
				const prod = pMap.get(id);
				if (!prod) return null;
				return {
					productId: prod.id,
					name: prod.name,
					shortName: prod.shortName,
					category: prod.category,
					subcategory: prod.subcategory,
					quantity: qty,
					unitPrice: prod.price,
					subtotal: prod.price * qty
				};
			})
			.filter((it): it is NonNullable<typeof it> => it !== null);

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

	// Patrones realistas de pedidos en La Vega con productos reales del nuevo catálogo
	const combos: Array<Array<{ id: string; qty: number }>> = [
		[
			{ id: 'emp-mechada', qty: 3 },
			{ id: 'beb-malta', qty: 1 }
		], // $5.000
		[
			{ id: 'emp-mechada-queso', qty: 2 },
			{ id: 'emp-pabellon', qty: 2 },
			{ id: 'jug-maracuya', qty: 2 }
		], // $8.000
		[
			{ id: 'are-pabellon', qty: 1 },
			{ id: 'beb-papelon', qty: 1 }
		], // $6.500
		[
			{ id: 'emp-queso-llanero', qty: 2 },
			{ id: 'emp-pollo-queso', qty: 2 },
			{ id: 'beb-coca-original', qty: 2 }
		], // $7.000
		[
			{ id: 'are-reina-pepiada', qty: 1 },
			{ id: 'jug-guanabana', qty: 1 }
		], // $6.000
		[
			{ id: 'emp-mechada', qty: 2 },
			{ id: 'emp-cazon', qty: 1 },
			{ id: 'beb-malta', qty: 2 }
		], // $8.500
		[
			{ id: 'are-desayuno-criollo', qty: 1 },
			{ id: 'jug-maracuya', qty: 1 }
		], // $7.000
		[
			{ id: 'emp-domino', qty: 2 },
			{ id: 'emp-platano-queso', qty: 1 },
			{ id: 'beb-frescolita', qty: 1 }
		], // $5.000
		[
			{ id: 'emp-trifasica', qty: 1 },
			{ id: 'emp-mechada', qty: 2 },
			{ id: 'beb-papelon-grande', qty: 1 }
		], // $8.500
		[
			{ id: 'are-pelua', qty: 1 },
			{ id: 'are-catira', qty: 1 },
			{ id: 'beb-coca-grande', qty: 1 }
		], // $10.500
		[
			{ id: 'emp-cordon-bleu', qty: 2 },
			{ id: 'emp-jamon-queso', qty: 2 },
			{ id: 'jug-mora', qty: 2 }
		], // $8.000
		[
			{ id: 'emp-naiguatarena', qty: 1 },
			{ id: 'beb-malta', qty: 1 }
		] // $5.000
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
				const p = pMap.get(item.id);
				return sum + (p ? p.price * item.qty : 0);
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
 * Registra una nueva venta ("Pinchar Papel / Guardar Ticket").
 * Actualmente guarda en estado local + localStorage en 0ms.
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
		subcategory: item.product.subcategory,
		quantity: item.quantity,
		unitPrice: item.product.price,
		subtotal: item.subtotal
	}));

	const total = saleItems.reduce((sum, it) => sum + it.subtotal, 0);
	const cashReceived =
		params.cashReceived && params.cashReceived >= total ? params.cashReceived : total;
	const changeGiven = Math.max(0, cashReceived - total);

	const newSale: SaleRecord = {
		id:
			typeof crypto !== 'undefined' && crypto.randomUUID
				? crypto.randomUUID()
				: `sale-${Date.now()}`,
		ticketNumber: params.nextTicketNumber,
		createdAt: now.toISOString(),
		items: saleItems,
		total,
		cashReceived,
		changeGiven,
		syncedWithSupabase: false
	};

	return newSale;
}

/**
 * ============================================================================
 * CAPA DE SERVICIO LISTA PARA SUPABASE: Cálculo de Cierre de Caja y Métricas
 * ============================================================================
 * Procesa los registros de ventas y retorna todas las métricas listas para la Vista 2:
 * 1. Cierre de Caja (Hoy)
 * 2. Producto Estrella (Hoy y Esta Semana)
 * 3. Flujo por Hora (Horas Pico de 07:00 a 17:00)
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
	let todayArepasCount = 0;
	let todayBebidasCount = 0;

	for (const sale of todaySales) {
		for (const item of sale.items) {
			todayTotalUnits += item.quantity;
			if (item.category === 'empanada') todayEmpanadasCount += item.quantity;
			else if (item.category === 'arepa') todayArepasCount += item.quantity;
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
					subcategory: prod.subcategory,
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
				.filter((i) => i.category === 'empanada' || i.category === 'arepa')
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
		todayArepasCount,
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
