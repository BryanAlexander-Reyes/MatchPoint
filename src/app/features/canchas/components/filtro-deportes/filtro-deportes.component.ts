import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanchasService } from '../../services/canchas.service';
import { DeporteId } from '../../models/deporte.model';

/** Chips de deporte, cada uno con su color propio. Filtra en un solo clic. */
@Component({
  selector: 'app-filtro-deportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filtro-deportes.component.html',
  styleUrl: './filtro-deportes.component.scss',
})
export class FiltroDeportesComponent {
  readonly canchasService = inject(CanchasService);

  seleccionar(id: DeporteId | null): void {
    this.canchasService.setSportFilter(id);
  }
}
