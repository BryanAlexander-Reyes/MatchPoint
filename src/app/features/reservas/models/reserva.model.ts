import { MetodoPagoId } from '../../../core/plataforma/plataforma.model';

export type EstadoReserva = 'confirmada' | 'pendiente' | 'cancelada';

/** Una reserva es siempre de 1 hora: `hora` es la hora de inicio (18 = 6:00 p. m.). */
export interface Reserva {
  id: string;
  canchaId: string;
  usuarioId: string;
  cliente: string;
  fecha: string;
  hora: number;
  precio: number;
  metodoPago: MetodoPagoId;
  estado: EstadoReserva;
}

/** Horario de las canchas: se puede reservar desde las 6:00 a. m. hasta las 10:00 p. m. */
export const HORAS_DEL_DIA: number[] = Array.from({ length: 17 }, (_, i) => i + 6);

export const TEXTO_ESTADO_RESERVA: Record<EstadoReserva, string> = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  cancelada: 'Cancelada',
};
