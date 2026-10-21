/**
 * Formatea un monto numérico en Pesos Chilenos (CLP) con separador de miles '.'
 * Ejemplo: 5000 -> "$5.000", 348500 -> "$348.500"
 */
export function formatCLP(amount: number): string {
	const rounded = Math.round(amount || 0);
	const isNegative = rounded < 0;
	const absStr = Math.abs(rounded)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	return isNegative ? `-$${absStr}` : `$${absStr}`;
}

/**
 * Formatea una fecha ISO a hora local chilena legible (ej: "11:42")
 */
export function formatTimeHHMM(isoString: string): string {
	try {
		const date = new Date(isoString);
		return date.toLocaleTimeString('es-CL', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	} catch {
		return '--:--';
	}
}

/**
 * Formatea la fecha actual en español (ej: "Miércoles 21 de Octubre")
 */
export function formatFullDateES(date: Date = new Date()): string {
	const formatted = date.toLocaleDateString('es-CL', {
		weekday: 'long',
		day: 'numeric',
		month: 'long'
	});
	return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Síntesis de micro-sonidos táctiles usando Web Audio API (100% offline, 0 latencia).
 * Ayuda a la dueña a confirmar toques sin siquiera mirar la pantalla en medio del ruido de La Vega.
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (!audioCtx) {
		const AudioContextClass =
			window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		if (AudioContextClass) {
			audioCtx = new AudioContextClass();
		}
	}
	if (audioCtx && audioCtx.state === 'suspended') {
		audioCtx.resume().catch(() => {});
	}
	return audioCtx;
}

export function triggerFeedback(type: 'tap' | 'remove' | 'checkout' | 'clear', soundEnabled = true): void {
	if (typeof window === 'undefined') return;

	// Vibración háptica en dispositivos móviles / tablets Android
	if ('vibrate' in navigator) {
		try {
			if (type === 'tap') navigator.vibrate(15);
			else if (type === 'remove') navigator.vibrate(25);
			else if (type === 'checkout') navigator.vibrate([30, 40, 60]);
			else if (type === 'clear') navigator.vibrate(40);
		} catch {
			// Ignorar si el navegador bloquea vibrate
		}
	}

	if (!soundEnabled) return;

	try {
		const ctx = getAudioContext();
		if (!ctx) return;

		const now = ctx.currentTime;

		if (type === 'tap') {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'sine';
			osc.frequency.setValueAtTime(580, now);
			osc.frequency.exponentialRampToValueAtTime(780, now + 0.045);
			gain.gain.setValueAtTime(0.12, now);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now);
			osc.stop(now + 0.05);
		} else if (type === 'remove') {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'triangle';
			osc.frequency.setValueAtTime(360, now);
			osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);
			gain.gain.setValueAtTime(0.12, now);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now);
			osc.stop(now + 0.065);
		} else if (type === 'checkout') {
			// Sonido satisfactorio de "Caja Registradora / Papel Pinchado" (doble tono ascendente)
			const notes = [523.25, 659.25, 1046.5]; // C5, E5, C6
			notes.forEach((freq, idx) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'triangle';
				const start = now + idx * 0.055;
				osc.frequency.setValueAtTime(freq, start);
				gain.gain.setValueAtTime(0.18, start);
				gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(start);
				osc.stop(start + 0.15);
			});
		}
	} catch {
		// Ignorar errores de Web Audio
	}
}
