import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanchasService } from '../../services/canchas.service';
import { ICONOS_DEPORTE, ICONO_TODOS } from '../../data/iconos-deporte';
import { ICONOS_CARACTERISTICA } from '../../data/iconos-caracteristica';

/**
 * Cabecera grande de la categoría de deporte activa: foto, título, descripción,
 * características destacadas y estadísticas reales (calculadas del propio dataset).
 */
@Component({
  selector: 'app-banner-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-categoria.component.html',
  styleUrl: './banner-categoria.component.scss',
})
export class BannerCategoriaComponent {
  readonly canchasService = inject(CanchasService);

  get iconoDeporte(): string {
    const sport = this.canchasService.sportFilter();
    return sport ? ICONOS_DEPORTE[sport] : ICONO_TODOS;
  }

  iconoCaracteristica(clave: string): string {
    return ICONOS_CARACTERISTICA[clave] ?? '';
  }
}
