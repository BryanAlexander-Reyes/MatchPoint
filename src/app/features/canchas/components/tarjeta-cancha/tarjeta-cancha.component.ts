import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cancha } from '../../models/cancha.model';
import { CanchasService } from '../../services/canchas.service';
import { ocupacionEjemplo } from '../../utils/ocupacion.util';

/** Tarjeta de una cancha en el grid. Componente presentacional: recibe todo por @Input. */
@Component({
  selector: 'app-tarjeta-cancha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-cancha.component.html',
  styleUrl: './tarjeta-cancha.component.scss',
})
export class TarjetaCanchaComponent {
  @Input({ required: true }) cancha!: Cancha;
  @Input() modo: 'usuario' | 'empresa' = 'usuario';
  @Input() esFavorita = false;

  @Output() reservar = new EventEmitter<string>();
  @Output() favorito = new EventEmitter<string>();
  @Output() gestionar = new EventEmitter<string>();

  private readonly canchasService = inject(CanchasService);

  get deporte() {
    return this.canchasService.deporte(this.cancha.deporteId);
  }

  get nombreEmpresa(): string {
    return this.canchasService.empresaNombre(this.cancha.empresaId);
  }

  get ocupacionSemana(): number {
    return ocupacionEjemplo(this.cancha.id);
  }
}
