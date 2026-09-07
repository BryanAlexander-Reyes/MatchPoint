import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanchasService } from '../../services/canchas.service';
import { FiltroDeportesComponent } from '../filtro-deportes/filtro-deportes.component';
import { BuscadorCanchasComponent } from '../buscador-canchas/buscador-canchas.component';
import { TarjetaCanchaComponent } from '../tarjeta-cancha/tarjeta-cancha.component';
import { BannerCategoriaComponent } from '../banner-categoria/banner-categoria.component';

type Rol = 'usuario' | 'empresa';

/**
 * Pantalla de Exploración de Canchas: une buscador, filtros de deporte, filtros
 * secundarios y el grid de resultados. Cambia datos y acciones según el rol activo.
 */
@Component({
  selector: 'app-exploracion-canchas',
  standalone: true,
  imports: [CommonModule, FiltroDeportesComponent, BuscadorCanchasComponent, TarjetaCanchaComponent, BannerCategoriaComponent],
  templateUrl: './exploracion-canchas.component.html',
  styleUrl: './exploracion-canchas.component.scss',
})
export class ExploracionCanchasComponent {
  readonly canchasService = inject(CanchasService);

  readonly rol = signal<Rol>('usuario');
  private readonly favoritas = signal<Set<string>>(new Set());

  cambiarRol(rol: Rol): void {
    this.rol.set(rol);
  }

  toggleFavorita(id: string): void {
    const actuales = new Set(this.favoritas());
    actuales.has(id) ? actuales.delete(id) : actuales.add(id);
    this.favoritas.set(actuales);
  }

  esFavorita(id: string): boolean {
    return this.favoritas().has(id);
  }

  reservar(id: string): void {
    // TODO: integrar con el módulo de Reservas cuando esté disponible
    console.log('Reservar cancha', id);
  }

  gestionar(id: string): void {
    // TODO: integrar con el módulo de gestión de canchas de la empresa
    console.log('Gestionar cancha', id);
  }
}
