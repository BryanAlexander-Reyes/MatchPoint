import { Injectable, computed, signal } from '@angular/core';
import { Deporte, DeporteId } from '../models/deporte.model';
import { Empresa } from '../models/empresa.model';
import { Cancha } from '../models/cancha.model';
import { GrupoResultado, ResultadoBusqueda } from '../models/busqueda.model';
import { CategoriaBanner } from '../models/categoria-banner.model';
import { CANCHAS, DEPORTES, EMPRESAS, ZONAS } from '../data/canchas.mock';
import { BANNERS_POR_DEPORTE, BANNER_TODOS } from '../data/categorias.mock';
import { normalizar } from '../utils/text.util';
import { ocupacionEjemplo } from '../utils/ocupacion.util';

const MAX_POR_GRUPO = 4;
const COLOR_NEUTRO = '#8CA099';

/**
 * Fuente de verdad para el módulo de Exploración de Canchas: datos, filtros activos
 * (deporte, zona, precio, disponibilidad, texto de búsqueda) y las sugerencias
 * agrupadas del buscador estilo Roblox.
 */
@Injectable({ providedIn: 'root' })
export class CanchasService {
  readonly deportes = signal<Deporte[]>(DEPORTES);
  readonly empresas = signal<Record<string, Empresa>>(EMPRESAS);
  readonly zonas = signal<string[]>(ZONAS);
  private readonly canchas = signal<Cancha[]>(CANCHAS);

  // ---- filtros activos ----
  readonly sportFilter = signal<DeporteId | null>(null);
  readonly zonaFiltro = signal<string>('');
  readonly precioMax = signal<number>(0);
  readonly soloDisponibles = signal<boolean>(false);
  readonly query = signal<string>('');

  readonly canchasFiltradas = computed(() => {
    const sport = this.sportFilter();
    const zona = this.zonaFiltro();
    const precioMaximo = this.precioMax();
    const soloDisp = this.soloDisponibles();
    const textoBuscado = normalizar(this.query().trim());

    return this.canchas().filter(cancha => {
      if (sport && cancha.deporteId !== sport) return false;
      if (zona && cancha.zona !== zona) return false;
      if (precioMaximo && cancha.precioHora > precioMaximo) return false;
      if (soloDisp && !cancha.disponibleAhora) return false;

      if (textoBuscado) {
        const nombreEmpresa = this.empresaNombre(cancha.empresaId);
        const nombreDeporte = this.deporte(cancha.deporteId).nombre;
        const textoCompleto = normalizar(`${cancha.nombre} ${nombreEmpresa} ${cancha.zona} ${nombreDeporte}`);
        if (!textoCompleto.includes(textoBuscado)) return false;
      }
      return true;
    });
  });

  readonly canchasPropias = computed(() => this.canchas().filter(c => c.esPropia));

  readonly ocupacionPromedioPropias = computed(() => {
    const propias = this.canchasPropias();
    if (!propias.length) return 0;
    const total = propias.reduce((acumulado, c) => acumulado + ocupacionEjemplo(c.id), 0);
    return Math.round(total / propias.length);
  });

  /** Todas las canchas de la categoría (deporte) activa, sin aplicar zona/precio/disponibilidad/texto. */
  readonly canchasDeCategoria = computed(() => {
    const sport = this.sportFilter();
    return sport ? this.canchas().filter(c => c.deporteId === sport) : this.canchas();
  });

  /** Estadísticas del banner de categoría: se calculan de verdad a partir de los datos, no son fijas. */
  readonly estadisticasCategoria = computed(() => {
    const lista = this.canchasDeCategoria();
    if (!lista.length) {
      return { totalCanchas: 0, empresasAsociadas: 0, calificacionPromedio: 0, precioPromedio: 0 };
    }
    const empresasUnicas = new Set(lista.map(c => c.empresaId));
    const sumaCalificacion = lista.reduce((acumulado, c) => acumulado + c.calificacion, 0);
    const sumaPrecio = lista.reduce((acumulado, c) => acumulado + c.precioHora, 0);
    return {
      totalCanchas: lista.length,
      empresasAsociadas: empresasUnicas.size,
      calificacionPromedio: sumaCalificacion / lista.length,
      precioPromedio: Math.round(sumaPrecio / lista.length),
    };
  });

  /** Contenido del banner de cabecera: cambia según el deporte seleccionado en los chips. */
  readonly bannerActual = computed<CategoriaBanner>(() => {
    const sport = this.sportFilter();
    return sport ? BANNERS_POR_DEPORTE[sport] : BANNER_TODOS;
  });

  deporte(id: DeporteId): Deporte {
    return this.deportes().find(d => d.id === id)!;
  }

  empresaNombre(id: string): string {
    return this.empresas()[id]?.nombre ?? '';
  }

  setSportFilter(id: DeporteId | null): void { this.sportFilter.set(id); }
  setZona(zona: string): void { this.zonaFiltro.set(zona); }
  setPrecioMax(valor: number): void { this.precioMax.set(valor); }
  setSoloDisponibles(valor: boolean): void { this.soloDisponibles.set(valor); }
  setQuery(texto: string): void { this.query.set(texto); }

  /** Construye los grupos del panel de sugerencias: Deportes, Canchas, Empresas, Zona. */
  buscarSugerencias(textoBusqueda: string): GrupoResultado[] {
    const q = normalizar(textoBusqueda.trim());
    if (!q) return [];

    const grupos: GrupoResultado[] = [];

    const deportes: ResultadoBusqueda[] = this.deportes()
      .filter(d => normalizar(d.nombre).includes(q))
      .map(d => ({ tipo: 'deporte', id: d.id, titulo: d.nombre, meta: 'Deporte', color: d.hex }));
    if (deportes.length) {
      grupos.push({ etiqueta: 'Deportes', items: deportes.slice(0, MAX_POR_GRUPO) });
    }

    const todasLasCanchas = this.canchas().filter(c => normalizar(c.nombre).includes(q));
    const canchas: ResultadoBusqueda[] = todasLasCanchas
      .slice(0, MAX_POR_GRUPO)
      .map(c => ({
        tipo: 'cancha',
        id: c.id,
        titulo: c.nombre,
        meta: `${this.empresaNombre(c.empresaId)} · ${c.zona}`,
        color: this.deporte(c.deporteId).hex,
      }));
    if (canchas.length) {
      grupos.push({
        etiqueta: 'Canchas',
        items: canchas,
        masResultados: Math.max(0, todasLasCanchas.length - MAX_POR_GRUPO),
      });
    }

    const empresas: ResultadoBusqueda[] = Object.values(this.empresas())
      .filter(e => normalizar(e.nombre).includes(q))
      .map(e => ({ tipo: 'empresa', id: e.id, titulo: e.nombre, meta: e.zona, color: COLOR_NEUTRO }));
    if (empresas.length) {
      grupos.push({ etiqueta: 'Empresas', items: empresas.slice(0, MAX_POR_GRUPO) });
    }

    const zonas: ResultadoBusqueda[] = this.zonas()
      .filter(z => normalizar(z).includes(q))
      .map(z => ({ tipo: 'zona', id: z, titulo: z, meta: 'Zona · Yopal', color: COLOR_NEUTRO }));
    if (zonas.length) {
      grupos.push({ etiqueta: 'Ciudad / Zona', items: zonas.slice(0, MAX_POR_GRUPO) });
    }

    return grupos;
  }

  /** Aplica el efecto correspondiente cuando el usuario elige un resultado del buscador. */
  seleccionarSugerencia(resultado: ResultadoBusqueda): void {
    switch (resultado.tipo) {
      case 'deporte':
        this.setSportFilter(resultado.id as DeporteId);
        this.setQuery('');
        break;
      case 'zona':
        this.setZona(resultado.id);
        this.setQuery('');
        break;
      case 'cancha':
      case 'empresa':
        this.setQuery(resultado.titulo);
        break;
    }
  }
}
