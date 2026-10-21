import type { DashboardMetrics, OrderItem, Product, SaleRecord } from '$lib/types/pos';
import {
	CATALOGO_PRODUCTOS,
	cargarVentasIniciales,
	generarDatosSemillaLaVega,
	guardarVentasEnStorage,
	obtenerMetricas,
	registrarVenta
} from '$lib/services/salesService';
import { triggerFeedback } from '$lib/utils/format';

export type ActiveTab = 'pos' | 'dashboard';

class PosStore {
	// Pestaña activa: 'pos' (Vista 1: Block de Notas) | 'dashboard' (Vista 2: Cierre de Caja)
	activeTab = $state<ActiveTab>('pos');

	// Catálogo de productos fijos
	products = $state<Product[]>(CATALOGO_PRODUCTOS);

	// Estado del pedido actual ("El Papel Digital")
	orderMap = $state<Record<string, number>>({});

	// Monto de efectivo entregado por el cliente (Calculadora de vuelto rápida)
	cashReceived = $state<number>(0);

	// Historial completo de ventas (pre-cargado con datos semilla + persistido en localStorage)
	sales = $state<SaleRecord[]>([]);

	// Preferencia de sonido táctil
	soundEnabled = $state<boolean>(true);

	// Notificación rápida no bloqueante al pinchar un papel
	lastPinchedSale = $state<SaleRecord | null>(null);
	private toastTimeout: ReturnType<typeof setTimeout> | null = null;

	// ID del último producto tocado para micro-animación visual
	lastTappedProductId = $state<string | null>(null);

	// Derivados en tiempo real (0ms de latencia)
	orderItems = $derived.by<OrderItem[]>(() => {
		const list: OrderItem[] = [];
		for (const product of this.products) {
			const qty = this.orderMap[product.id] ?? 0;
			if (qty > 0) {
				list.push({
					product,
					quantity: qty,
					subtotal: product.price * qty
				});
			}
		}
		return list;
	});

	currentTotal = $derived.by<number>(() => {
		return this.orderItems.reduce((sum, item) => sum + item.subtotal, 0);
	});

	currentTotalUnits = $derived.by<number>(() => {
		return this.orderItems.reduce((sum, item) => sum + item.quantity, 0);
	});

	changeAmount = $derived.by<number>(() => {
		if (this.currentTotal === 0 || this.cashReceived <= 0) return 0;
		return this.cashReceived - this.currentTotal;
	});

	// Métricas en tiempo real para la Vista 2 (Dashboard)
	metrics = $derived.by<DashboardMetrics>(() => {
		return obtenerMetricas(this.sales, this.products);
	});

	// Ventas del día de hoy ordenadas de más reciente a más antigua (El "Clavo Digital")
	todaySalesList = $derived.by<SaleRecord[]>(() => {
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		return this.sales
			.filter((s) => new Date(s.createdAt).getTime() >= todayStart.getTime())
			.slice()
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	});

	// Número correlativo del próximo papel del día
	nextTicketNumber = $derived.by<number>(() => {
		if (this.todaySalesList.length === 0) return 1;
		const maxNum = Math.max(...this.todaySalesList.map((s) => s.ticketNumber));
		return maxNum + 1;
	});

	constructor() {
		// Inicializar datos en cliente o SSR
		this.sales = cargarVentasIniciales();
	}

	/**
	 * Re-sincroniza desde localStorage al montar en el navegador
	 */
	initClient(): void {
		this.sales = cargarVentasIniciales();
	}

	/**
	 * Agrega +1 unidad de un producto al Papel Digital
	 */
	addProduct(productId: string): void {
		const currentQty = this.orderMap[productId] ?? 0;
		this.orderMap = {
			...this.orderMap,
			[productId]: currentQty + 1
		};
		this.lastTappedProductId = productId;
		triggerFeedback('tap', this.soundEnabled);
	}

	/**
	 * Resta -1 unidad de un producto en el Papel Digital (o lo elimina si llega a 0)
	 */
	decrementProduct(productId: string): void {
		const currentQty = this.orderMap[productId] ?? 0;
		if (currentQty <= 1) {
			const updated = { ...this.orderMap };
			delete updated[productId];
			this.orderMap = updated;
		} else {
			this.orderMap = {
				...this.orderMap,
				[productId]: currentQty - 1
			};
		}
		triggerFeedback('remove', this.soundEnabled);
	}

	/**
	 * Elimina por completo una línea del Papel Digital
	 */
	removeLine(productId: string): void {
		const updated = { ...this.orderMap };
		delete updated[productId];
		this.orderMap = updated;
		triggerFeedback('remove', this.soundEnabled);
	}

	/**
	 * Limpia todo el Papel Digital actual sin cobrar
	 */
	clearCurrentOrder(): void {
		if (this.currentTotalUnits === 0) return;
		this.orderMap = {};
		this.cashReceived = 0;
		triggerFeedback('clear', this.soundEnabled);
	}

	/**
	 * Define o suma un billete en la calculadora de vuelto rápida
	 */
	setCashBill(amount: number, additive = false): void {
		if (amount === 0) {
			this.cashReceived = 0;
			return;
		}
		if (additive && this.cashReceived > 0) {
			this.cashReceived += amount;
		} else {
			this.cashReceived = amount;
		}
		triggerFeedback('tap', this.soundEnabled);
	}

	/**
	 * Acción Principal: "PINCHAR PAPEL / COBRAR"
	 * 1. Guarda la venta en 0ms
	 * 2. Limpia la pantalla inmediatamente para el siguiente cliente en la fila
	 * 3. Muestra notificación con botón "Deshacer" por 6 segundos
	 */
	async pincharPapel(): Promise<void> {
		if (this.orderItems.length === 0) return;

		const snapshotItems = [...this.orderItems];
		const ticketNumber = this.nextTicketNumber;
		const cashGiven = this.cashReceived > 0 ? this.cashReceived : this.currentTotal;

		// 1. Limpieza instantánea en 0ms (Zero-Latency para atender al siguiente cliente)
		this.orderMap = {};
		this.cashReceived = 0;
		triggerFeedback('checkout', this.soundEnabled);

		// 2. Registro de la venta en la capa de servicio + localStorage
		const createdSale = await registrarVenta({
			items: snapshotItems,
			nextTicketNumber: ticketNumber,
			cashReceived: cashGiven
		});

		this.sales = [...this.sales, createdSale];
		guardarVentasEnStorage(this.sales);

		// 3. Feedback visual rápido no bloqueante con opción a deshacer
		this.lastPinchedSale = createdSale;
		if (this.toastTimeout) clearTimeout(this.toastTimeout);
		this.toastTimeout = setTimeout(() => {
			this.lastPinchedSale = null;
		}, 6000);
	}

	/**
	 * Permite deshacer el último papel pinchado si la dueña presionó Cobrar por error
	 * y restaura los ítems al papel activo para que los edite.
	 */
	undoLastSale(): void {
		if (!this.lastPinchedSale) return;
		const saleToUndo = this.lastPinchedSale;

		// Quitar del registro de ventas
		this.sales = this.sales.filter((s) => s.id !== saleToUndo.id);
		guardarVentasEnStorage(this.sales);

		// Restaurar los productos al Papel Digital activo
		const restoredMap: Record<string, number> = {};
		for (const item of saleToUndo.items) {
			restoredMap[item.productId] = item.quantity;
		}
		this.orderMap = restoredMap;
		this.cashReceived = saleToUndo.cashReceived ?? 0;
		this.lastPinchedSale = null;

		if (this.toastTimeout) clearTimeout(this.toastTimeout);
		triggerFeedback('remove', this.soundEnabled);
	}

	/**
	 * Anula un ticket específico desde el historial del día ("Clavo Digital")
	 */
	deleteSaleById(saleId: string): void {
		this.sales = this.sales.filter((s) => s.id !== saleId);
		guardarVentasEnStorage(this.sales);
		triggerFeedback('remove', this.soundEnabled);
	}

	/**
	 * Restaura los datos de prueba de La Vega (útil para demostraciones)
	 */
	resetDemoData(): void {
		const freshSeed = generarDatosSemillaLaVega(new Date());
		this.sales = freshSeed;
		guardarVentasEnStorage(freshSeed);
		this.orderMap = {};
		this.cashReceived = 0;
		this.lastPinchedSale = null;
		triggerFeedback('checkout', this.soundEnabled);
	}
}

export const posStore = new PosStore();
