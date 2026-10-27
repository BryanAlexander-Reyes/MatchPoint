import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlataformaService } from '../../../../core/plataforma/plataforma.service';
import { MetodoPagoId } from '../../../../core/plataforma/plataforma.model';
import { IconoComponent } from '../../../../shared/icono/icono.component';
import { etiquetaDia, fechaCorta, fechaLarga, horaTexto } from '../../../../shared/utils/fechas.util';
import { CanchasService } from '../../../canchas/services/canchas.service';
import { ReservasService } from '../../services/reservas.service';
import { Reserva, TEXTO_ESTADO_RESERVA } from '../../models/reserva.model';

/** "Mis reservas" del jugador: lo que viene (con opción de cancelar) y su historial. */
@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, IconoComponent],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.scss',
})
export class MisReservasComponent {
  readonly reservasService = inject(ReservasService);
  private readonly canchasService = inject(CanchasService);
  private readonly plataforma = inject(PlataformaService);

  /** Reserva a la que se le tocó "Cancelar" y espera la segunda confirmación. */
  readonly porCancelar = signal<string | null>(null);

  readonly textoEstado = TEXTO_ESTADO_RESERVA;
  readonly etiquetaDia = etiquetaDia;
  readonly fechaLarga = fechaLarga;
  readonly fechaCorta = fechaCorta;
  readonly horaTexto = horaTexto;

  cancha(reserva: Reserva) {
    return this.canchasService.cancha(reserva.canchaId);
  }

  colorDeporte(reserva: Reserva): string {
    const cancha = this.cancha(reserva);
    return cancha ? this.canchasService.deporte(cancha.deporteId).hex : 'var(--brand)';
  }

  nombreEmpresa(reserva: Reserva): string {
    const cancha = this.cancha(reserva);
    return cancha ? this.canchasService.empresaNombre(cancha.empresaId) : '';
  }

  nombreMetodo(id: MetodoPagoId): string {
    return this.plataforma.metodosPago().find(m => m.id === id)?.nombre ?? id;
  }

  cancelar(id: string): void {
    this.reservasService.cancelar(id);
    this.porCancelar.set(null);
  }
}
