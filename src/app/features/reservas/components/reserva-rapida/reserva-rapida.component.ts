import { Component, EventEmitter, HostListener, Input, Output, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlataformaService } from '../../../../core/plataforma/plataforma.service';
import { MetodoPagoId } from '../../../../core/plataforma/plataforma.model';
import { IconoComponent } from '../../../../shared/icono/icono.component';
import { diaDelMes, etiquetaDia, fechaLarga, horaTexto, hoyISO, proximosDias } from '../../../../shared/utils/fechas.util';
import { CanchasService } from '../../../canchas/services/canchas.service';
import { Cancha } from '../../../canchas/models/cancha.model';
import { ReservasService } from '../../services/reservas.service';
import { HORAS_DEL_DIA, Reserva } from '../../models/reserva.model';

type EstadoHorario = 'libre' | 'ocupada' | 'pasada';

const FRANJAS = [
  { nombre: 'Mañana', desde: 6, hasta: 11 },
  { nombre: 'Tarde', desde: 12, hasta: 17 },
  { nombre: 'Noche', desde: 18, hasta: 22 },
];

/**
 * Reserva en 3 pasos, todos visibles a la vez: día → hora → forma de pago → Confirmar.
 * Se abre como panel lateral en computador y como hoja desde abajo en celular,
 * pintado con el color del deporte de la cancha.
 */
@Component({
  selector: 'app-reserva-rapida',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, IconoComponent],
  templateUrl: './reserva-rapida.component.html',
  styleUrl: './reserva-rapida.component.scss',
})
export class ReservaRapidaComponent {
  @Input({ required: true }) cancha!: Cancha;
  @Output() cerrar = new EventEmitter<void>();

  private readonly reservasService = inject(ReservasService);
  private readonly canchasService = inject(CanchasService);
  readonly plataforma = inject(PlataformaService);

  readonly dias = proximosDias(7);
  readonly fecha = signal(hoyISO());
  readonly hora = signal<number | null>(null);
  private readonly metodoElegido = signal<MetodoPagoId | null>(null);
  readonly reservaHecha = signal<Reserva | null>(null);

  readonly etiquetaDia = etiquetaDia;
  readonly diaDelMes = diaDelMes;
  readonly horaTexto = horaTexto;
  readonly fechaLarga = fechaLarga;

  /** Si el jugador no elige, queda el primer método que el administrador tenga activo. */
  readonly metodo = computed(() => this.metodoElegido() ?? this.plataforma.metodosActivos()[0]?.id ?? null);

  readonly franjas = computed(() => {
    const ocupadas = this.reservasService.horasOcupadas(this.cancha.id, this.fecha());
    return FRANJAS.map(franja => ({
      nombre: franja.nombre,
      horas: HORAS_DEL_DIA.filter(h => h >= franja.desde && h <= franja.hasta).map(hora => ({
        hora,
        estado: (ocupadas.has(hora)
          ? 'ocupada'
          : this.reservasService.yaPaso({ fecha: this.fecha(), hora })
            ? 'pasada'
            : 'libre') as EstadoHorario,
      })),
    }));
  });

  readonly horasLibres = computed(() =>
    this.franjas().reduce((total, f) => total + f.horas.filter(h => h.estado === 'libre').length, 0),
  );

  get deporte() {
    return this.canchasService.deporte(this.cancha.deporteId);
  }

  get nombreEmpresa(): string {
    return this.canchasService.empresaNombre(this.cancha.empresaId);
  }

  elegirDia(fecha: string): void {
    this.fecha.set(fecha);
    this.hora.set(null);
  }

  elegirMetodo(id: MetodoPagoId): void {
    this.metodoElegido.set(id);
  }

  confirmar(): void {
    const hora = this.hora();
    const metodo = this.metodo();
    if (hora === null || !metodo) return;
    const reserva = this.reservasService.crear({
      canchaId: this.cancha.id,
      fecha: this.fecha(),
      hora,
      precio: this.cancha.precioHora,
      metodoPago: metodo,
    });
    this.reservaHecha.set(reserva);
  }

  nombreMetodo(id: MetodoPagoId): string {
    return this.plataforma.metodosPago().find(m => m.id === id)?.nombre ?? id;
  }

  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    this.cerrar.emit();
  }
}
