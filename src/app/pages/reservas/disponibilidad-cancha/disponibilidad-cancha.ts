import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EstadoFranja, FranjaModel } from '../../../models/reservas/model-reserva';
import { IconComponent, NombreIcono } from '../../../shared/components/icon/icon';
import { fechaLarga } from '../../../shared/utils/fechas';

type Vista = 'grid' | 'lista';

@Component({
  selector: 'app-disponibilidad-cancha',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './disponibilidad-cancha.html',
  styleUrl: './disponibilidad-cancha.css',
})
export class DisponibilidadCancha {
  @Input({ required: true }) franjas: FranjaModel[] = [];
  @Input({ required: true }) fecha: string = '';
  @Input() horaSeleccionada: string = '';
  @Output() seleccionar = new EventEmitter<FranjaModel>();

  tituloDisponibilidad: string = 'Disponibilidad';
  textoTiempoReal: string = 'Los horarios están actualizados en tiempo real.';

  vista: Vista = 'grid';

  readonly leyenda: { estado: EstadoFranja; texto: string }[] = [
    { estado: 'disponible', texto: 'Disponible' },
    { estado: 'reservada', texto: 'Reservada' },
    { estado: 'no-disponible', texto: 'No disponible' },
  ];

  private readonly estados: Record<EstadoFranja, { texto: string; icono: NombreIcono }> = {
    disponible: { texto: 'Disponible', icono: 'users' },
    reservada: { texto: 'Reservada', icono: 'users' },
    'no-disponible': { texto: 'No disponible', icono: 'lock' },
  };

  get fechaTexto(): string {
    return this.fecha ? fechaLarga(this.fecha) : '';
  }

  textoEstado(franja: FranjaModel): string {
    return franja.inicio === this.horaSeleccionada ? 'Seleccionado' : this.estados[franja.estado].texto;
  }

  iconoEstado(franja: FranjaModel): NombreIcono {
    return this.estados[franja.estado].icono;
  }

  cambiarVista(vista: Vista): void {
    this.vista = vista;
  }
}
