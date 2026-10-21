export type ProductCategory = 'empanada' | 'bebida';

export type ProductColorKey = 'amber' | 'rose' | 'yellow' | 'indigo' | 'orange' | 'cyan';

export interface Product {
	id: string;
	name: string;
	shortName: string;
	subtitle: string;
	category: ProductCategory;
	price: number;
	colorKey: ProductColorKey;
	badgeCode: string;
	emoji: string;
}

export interface OrderItem {
	product: Product;
	quantity: number;
	subtotal: number;
}

export interface SaleItemRecord {
	productId: string;
	name: string;
	shortName: string;
	category: ProductCategory;
	quantity: number;
	unitPrice: number;
	subtotal: number;
}

export interface SaleRecord {
	id: string;
	ticketNumber: number;
	createdAt: string; // ISO 8601 timestamp
	items: SaleItemRecord[];
	total: number;
	cashReceived?: number;
	changeGiven?: number;
	syncedWithSupabase?: boolean;
}

export interface ProductMetricItem {
	productId: string;
	name: string;
	shortName: string;
	emoji: string;
	category: ProductCategory;
	colorKey: ProductColorKey;
	units: number;
	revenue: number;
	sharePercent: number; // % of total units
	revenuePercent: number; // % of total CLP
}

export interface HourlyBucket {
	hour: number; // 7 to 18
	label: string; // "08:00", "09:00", etc.
	shortLabel: string; // "8h", "9h"
	tickets: number;
	revenue: number;
	empanadasUnits: number;
	intensityPercent: number; // 0 to 100 relative to peak hour
	isPeak: boolean;
}

export interface DailyComparisonPoint {
	dayName: string; // "Lun", "Mar", etc.
	fullDayName: string;
	currentWeekRevenue: number;
	previousWeekRevenue: number;
	currentWeekTickets: number;
	isToday: boolean;
	isFutureDay: boolean;
}

export interface WeeklyComparisonMetrics {
	currentWeekTotal: number;
	previousWeekTotal: number;
	currentWeekTickets: number;
	previousWeekTickets: number;
	deltaAmount: number;
	deltaPercent: number;
	trend: 'up' | 'down' | 'neutral';
	dailyBreakdown: DailyComparisonPoint[];
}

export interface DashboardMetrics {
	todayTotal: number;
	todayTicketsCount: number;
	todayAverageTicket: number;
	todayTotalUnits: number;
	todayEmpanadasCount: number;
	todayBebidasCount: number;
	starProductToday: ProductMetricItem | null;
	starProductWeek: ProductMetricItem | null;
	productRankingToday: ProductMetricItem[];
	productRankingWeek: ProductMetricItem[];
	hourlyFlow: HourlyBucket[];
	peakHour: HourlyBucket | null;
	weeklyComparison: WeeklyComparisonMetrics;
}
