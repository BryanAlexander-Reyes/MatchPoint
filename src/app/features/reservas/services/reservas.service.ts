import { Injectable, computed, inject, signal } from '@angular/core';
import { SesionService } from '../../../core/sesion/sesion.service';
import { MetodoPagoId } from '../../../core/plataforma/plataforma.model';
import { hoyISO } from '../../../shared/utils/fechas.util';
import { Reserva } from '../models/reserva.model';
import { reservasIniciales } from '../data/reservas.mock';

export interface NuevaReserva {
  canchaId: string;
  fecha: string;
  hora: number;
  precio: number;
  metodoPago: MetodoPagoId;
}

const porFechaYHora = (a: Reserva, b: Reserva) => a.fecha.localeCompare(b.fecha) || a.hora - b.hora;

/**
 * Todas las reservas de la plataforma. Cada rol ve una parte:
 * el jugador las suyas, la empresa las de sus canchas, el administrador todas.
 * Con backend: GET /api/reservas, POST /api/reservas, PATCH /api/reservas/:id.
 */
@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly sesion = inject(SesionService);

  readonly reservas = signal<Reserva[]>(reservasIniciales());

  private readonly mias = computed(() => {
    const usuarioId = this.sesion.usuario()?.id;
    return this.reservas().filter(r => r.usuarioId === usuarioId);
  });

  readonly misProximas = computed(() =>
    this.mias().filter(r => r.estado !== 'cancelada' && !this.yaPaso(r)).sort(porFechaYHora),
  );

  readonly miHistorial = computed(() =>
    this.mias().filter(r => r.estado === 'cancelada' || this.yaPaso(r)).sort((a, b) => porFechaYHora(b, a)),
  );

  /** Horas que ya no se pueden reservar en esa cancha ese día. */
  horasOcupadas(canchaId: string, fecha: string): Set<number> {
    return new Set(
      this.reservas()
        .filter(r => r.canchaId === canchaId && r.fecha === fecha && r.estado !== 'cancelada')
        .map(r => r.hora),
    );
  }

  deCanchas(canchaIds: string[], fecha: string): Reserva[] {
    return this.reservas()
      .filter(r => r.fecha === fecha && canchaIds.includes(r.canchaId) && r.estado !== 'cancelada')
      .sort(porFechaYHora);
  }

  yaPaso(reserva: Pick<Reserva, 'fecha' | 'hora'>): boolean {
    const hoy = hoyISO();
    return reserva.fecha < hoy || (reserva.fecha === hoy && reserva.hora <= new Date().getHours());
  }

  crear(datos: NuevaReserva): Reserva {
    const usuario = this.sesion.usuario();
    const reserva: Reserva = {
      ...datos,
      id: `r-${Date.now()}`,
      usuarioId: usuario?.id ?? 'anonimo',
      cliente: usuario?.nombre ?? 'Cliente',
      // Pagar en la cancha queda pendiente hasta que la empresa confirme la llegada.
      estado: datos.metodoPago === 'en-cancha' ? 'pendiente' : 'confirmada',
    };
    this.reservas.update(lista => [...lista, reserva]);
    return reserva;
  }

  cancelar(id: string): void {
    this.cambiarEstado(id, 'cancelada');
  }

  confirmar(id: string): void {
    this.cambiarEstado(id, 'confirmada');
  }

  private cambiarEstado(id: string, estado: Reserva['estado']): void {
    this.reservas.update(lista => lista.map(r => (r.id === id ? { ...r, estado } : r)));
  }
}
