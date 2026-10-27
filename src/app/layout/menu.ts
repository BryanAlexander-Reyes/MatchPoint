import { Rol } from '../core/sesion/sesion.model';
import { NombreIcono } from '../shared/icono/icono.component';

export interface ItemMenu {
  texto: string;
  ruta: string;
  icono: NombreIcono;
}

/**
 * Cada rol ve solo lo suyo. Pocas opciones a propósito: si alguien tiene que pensar
 * dónde hacer clic, sobra una opción.
 */
export const MENU_POR_ROL: Record<Rol, ItemMenu[]> = {
  usuario: [
    { texto: 'Buscar canchas', ruta: '/canchas', icono: 'buscar' },
    { texto: 'Mis reservas', ruta: '/reservas', icono: 'calendario' },
  ],
  empresa: [
    { texto: 'Mi panel', ruta: '/empresa', icono: 'panel' },
    { texto: 'Cómo me ven', ruta: '/canchas', icono: 'buscar' },
  ],
  admin: [
    { texto: 'Panel general', ruta: '/admin', icono: 'escudo' },
    { texto: 'Todas las canchas', ruta: '/canchas', icono: 'buscar' },
  ],
};
