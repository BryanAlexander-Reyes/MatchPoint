import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CanchasService } from '../../services/canchas.service';
import { DeporteId } from '../../models/deporte.model';
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
  private readonly sanitizer = inject(DomSanitizer);

  // Angular borra los <svg> que llegan por [innerHTML]. Estos íconos son cadenas fijas nuestras
  // (no contenido de usuarios), así que se marcan como confiables una sola vez.
  private readonly confiar = (svg: string): SafeHtml => this.sanitizer.bypassSecurityTrustHtml(svg);
  private readonly iconosDeporte = Object.fromEntries(
    Object.entries(ICONOS_DEPORTE).map(([id, svg]) => [id, this.confiar(svg)]),
  ) as Record<DeporteId, SafeHtml>;
  private readonly iconoTodos = this.confiar(ICONO_TODOS);
  private readonly iconosCaracteristica: Record<string, SafeHtml> = Object.fromEntries(
    Object.entries(ICONOS_CARACTERISTICA).map(([clave, svg]) => [clave, this.confiar(svg)]),
  );

  get iconoDeporte(): SafeHtml {
    const sport = this.canchasService.sportFilter();
    return sport ? this.iconosDeporte[sport] : this.iconoTodos;
  }

  iconoCaracteristica(clave: string): SafeHtml | string {
    return this.iconosCaracteristica[clave] ?? '';
  }
}
