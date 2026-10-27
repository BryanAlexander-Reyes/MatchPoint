import { hoyISO, sumarDias } from '../../shared/utils/fechas.util';
import { MetodoPago, Suscripcion } from './plataforma.model';

export const VALOR_MENSUALIDAD_INICIAL = 20_000;

export const METODOS_PAGO: MetodoPago[] = [
  { id: 'en-cancha', nombre: 'En la cancha', descripcion: 'Efectivo al llegar', activo: true },
  { id: 'nequi', nombre: 'Nequi', descripcion: 'Desde tu celular', activo: true },
  { id: 'daviplata', nombre: 'Daviplata', descripcion: 'Desde tu celular', activo: false },
  { id: 'tarjeta', nombre: 'Tarjeta', descripcion: 'Crédito o débito', activo: true },
  { id: 'pse', nombre: 'PSE', descripcion: 'Débito a tu banco', activo: false },
];

/**
 * Días que faltan para el próximo cobro de cada empresa (negativo = ya venció).
 * Se cuentan desde hoy para que la demo siempre muestre casos al día, por vencer y vencidos.
 */
const DIAS_PARA_COBRO: Record<string, number> = {
  'arena-sport': 12,
  'futbol-center': 3,
  'green-fields': -4,
  'playball': 20,
  'sunset': 8,
  'oasis-beach': -1,
  'blue-beach': 25,
  'power-padel': 2,
  'elite-sports': 15,
};

export function suscripcionesIniciales(): Record<string, Suscripcion> {
  const hoy = hoyISO();
  return Object.fromEntries(
    Object.entries(DIAS_PARA_COBRO).map(([empresaId, dias]) => {
      const proximoCobro = sumarDias(hoy, dias);
      return [empresaId, { empresaId, proximoCobro, ultimoPago: sumarDias(proximoCobro, -30), suspendida: false }];
    }),
  );
}
