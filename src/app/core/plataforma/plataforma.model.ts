export type MetodoPagoId = 'en-cancha' | 'nequi' | 'daviplata' | 'tarjeta' | 'pse';

export interface MetodoPago {
  id: MetodoPagoId;
  nombre: string;
  descripcion: string;
  /** El administrador decide qué métodos ven los jugadores al reservar. */
  activo: boolean;
}

/** Mensualidad que cada empresa paga para tener sus canchas publicadas. */
export interface Suscripcion {
  empresaId: string;
  ultimoPago: string;
  proximoCobro: string;
  /** El administrador puede suspender una empresa: sus canchas dejan de aparecer. */
  suspendida: boolean;
}

export type EstadoSuscripcion = 'al-dia' | 'por-vencer' | 'vencida' | 'suspendida';

export const TEXTO_ESTADO_SUSCRIPCION: Record<EstadoSuscripcion, string> = {
  'al-dia': 'Al día',
  'por-vencer': 'Por vencer',
  vencida: 'Vencida',
  suspendida: 'Suspendida',
};
