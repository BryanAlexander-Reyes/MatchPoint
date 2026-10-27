import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SesionService } from '../../../core/sesion/sesion.service';
import { PlataformaService } from '../../../core/plataforma/plataforma.service';
import { MetodoPagoId, TEXTO_ESTADO_SUSCRIPCION } from '../../../core/plataforma/plataforma.model';
import { IconoComponent } from '../../../shared/icono/icono.component';
import { diaDelMes, diasHasta, etiquetaDia, fechaCorta, fechaLarga, horaTexto, hoyISO, proximosDias } from '../../../shared/utils/fechas.util';
import { CanchasService } from '../../canchas/services/canchas.service';
import { Cancha } from '../../canchas/models/cancha.model';
import { ReservasService } from '../../reservas/services/reservas.service';
import { HORAS_DEL_DIA, Reserva, TEXTO_ESTADO_RESERVA } from '../../reservas/models/reserva.model';

/**
 * Panel de la empresa: todo lo del día en una pantalla. Agenda por cancha y hora,
 * reservas por confirmar, abrir/cerrar canchas y el estado de la mensualidad.
 */
@Component({
  selector: 'app-panel-empresa',
  standalone: true,
  imports: [CurrencyPipe, IconoComponent],
  templateUrl: './panel-empresa.component.html',
  styleUrl: './panel-empresa.component.scss',
})
export class PanelEmpresaComponent {
  readonly sesion = inject(SesionService);
  readonly plataforma = inject(PlataformaService);
  readonly canchasService = inject(CanchasService);
  readonly reservasService = inject(ReservasService);

  readonly horas = HORAS_DEL_DIA;
  readonly dias = proximosDias(7);
  readonly fecha = signal(hoyISO());

  readonly textoEstadoReserva = TEXTO_ESTADO_RESERVA;
  readonly textoEstadoSuscripcion = TEXTO_ESTADO_SUSCRIPCION;
  readonly etiquetaDia = etiquetaDia;
  readonly diaDelMes = diaDelMes;
  readonly fechaLarga = fechaLarga;
  readonly fechaCorta = fechaCorta;
  readonly horaTexto = horaTexto;

  readonly empresaId = computed(() => this.sesion.empresaId() ?? '');
  readonly nombreEmpresa = computed(() => this.canchasService.empresaNombre(this.empresaId()));
  readonly primerNombre = computed(() => this.sesion.usuario()?.nombre.split(' ')[0] ?? '');
  readonly canchas = this.canchasService.canchasPropias;

  readonly reservasDelDia = computed(() =>
    this.reservasService.deCanchas(this.canchas().map(c => c.id), this.fecha()),
  );

  /** Una fila por cancha con sus reservas indexadas por hora, para dibujar la agenda. */
  readonly agenda = computed(() =>
    this.canchas().map(cancha => ({
      cancha,
      color: this.canchasService.deporte(cancha.deporteId).hex,
      porHora: new Map(this.reservasDelDia().filter(r => r.canchaId === cancha.id).map(r => [r.hora, r])),
    })),
  );

  readonly ingresosDelDia = computed(() => this.reservasDelDia().reduce((total, r) => total + r.precio, 0));

  readonly ocupacion = computed(() => {
    const espacios = this.canchas().length * this.horas.length;
    return espacios ? Math.round((this.reservasDelDia().length / espacios) * 100) : 0;
  });

  readonly proxima = computed(() => this.reservasDelDia().find(r => !this.reservasService.yaPaso(r)) ?? null);
  readonly pendientes = computed(() => this.reservasDelDia().filter(r => r.estado === 'pendiente').length);

  readonly suscripcion = computed(() => this.plataforma.suscripcionDe(this.empresaId()));
  readonly estadoSuscripcion = computed(() => this.plataforma.estadoDe(this.suscripcion()));
  readonly diasParaCobro = computed(() => {
    const suscripcion = this.suscripcion();
    return suscripcion ? diasHasta(suscripcion.proximoCobro) : 0;
  });
  readonly pagoRegistrado = signal(false);

  readonly ventajas = [
    'Tus canchas visibles para todos los jugadores de Yopal',
    'Reservas en línea, sin llamadas ni WhatsApp',
    'Agenda del día y ocupación de cada cancha',
    'Cobros con Nequi, tarjeta o en la cancha',
  ];

  nombreCancha(reserva: Reserva): string {
    return this.canchasService.cancha(reserva.canchaId)?.nombre ?? '';
  }

  nombreMetodo(id: MetodoPagoId): string {
    return this.plataforma.metodosPago().find(m => m.id === id)?.nombre ?? id;
  }

  /** 18 → "6p", para la cabecera angosta de la agenda. */
  horaCorta(hora: number): string {
    return `${hora % 12 || 12}${hora < 12 ? 'a' : 'p'}`;
  }

  horaPasada(hora: number): boolean {
    return this.reservasService.yaPaso({ fecha: this.fecha(), hora });
  }

  toggleDisponible(cancha: Cancha): void {
    this.canchasService.setDisponible(cancha.id, !cancha.disponibleAhora);
  }

  pagarMensualidad(): void {
    this.plataforma.registrarPago(this.empresaId());
    this.pagoRegistrado.set(true);
  }
}
