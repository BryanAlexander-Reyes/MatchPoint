import { MetodoPagoId } from '../../../core/plataforma/plataforma.model';
import { USUARIOS_DEMO } from '../../../core/sesion/usuarios.mock';
import { hoyISO, sumarDias } from '../../../shared/utils/fechas.util';
import { CANCHAS } from '../../canchas/data/canchas.mock';
import { HORAS_DEL_DIA, Reserva } from '../models/reserva.model';

const CLIENTES = [
  'Juan Pérez', 'María Rodríguez', 'Andrés Silva', 'Laura Martínez', 'Santiago Rojas',
  'Daniela Torres', 'Felipe Castro', 'Camila Vargas', 'Sebastián Díaz', 'Paula Moreno',
];
const METODOS: MetodoPagoId[] = ['en-cancha', 'nequi', 'tarjeta'];

function hash(texto: string): number {
  let resultado = 0;
  for (const caracter of texto) resultado = (resultado * 31 + caracter.charCodeAt(0)) % 10007;
  return resultado;
}

/** Probabilidad (de 100) de que una hora esté reservada: las noches se llenan más. */
function probabilidad(hora: number): number {
  if (hora >= 17 && hora <= 21) return 62;
  if (hora >= 7 && hora <= 9) return 30;
  return 14;
}

/**
 * Reservas de ejemplo de las últimas 2 semanas y la próxima, para que la agenda de la empresa
 * y el panel del administrador tengan datos. Son determinísticas (no cambian al recargar).
 */
export function reservasIniciales(): Reserva[] {
  const hoy = hoyISO();
  const reservas: Reserva[] = [];

  for (const cancha of CANCHAS) {
    for (let dia = -14; dia <= 6; dia++) {
      const fecha = sumarDias(hoy, dia);
      for (const hora of HORAS_DEL_DIA) {
        const h = hash(`${cancha.id}|${dia}|${hora}`);
        if (h % 100 >= probabilidad(hora)) continue;
        const indiceCliente = h % CLIENTES.length;
        reservas.push({
          id: `r-${cancha.id}-${fecha}-${hora}`,
          canchaId: cancha.id,
          usuarioId: `cliente-${indiceCliente}`,
          cliente: CLIENTES[indiceCliente],
          fecha,
          hora,
          precio: cancha.precioHora,
          metodoPago: METODOS[h % METODOS.length],
          estado: dia >= 0 && h % 6 === 0 ? 'pendiente' : dia < 0 && h % 11 === 0 ? 'cancelada' : 'confirmada',
        });
      }
    }
  }

  const jugadora = USUARIOS_DEMO.usuario;
  const deLaJugadora: Reserva[] = [
    { id: 'r-demo-1', canchaId: 'c10', usuarioId: jugadora.id, cliente: jugadora.nombre, fecha: sumarDias(hoy, 1), hora: 18, precio: 55000, metodoPago: 'nequi', estado: 'confirmada' },
    { id: 'r-demo-2', canchaId: 'c18', usuarioId: jugadora.id, cliente: jugadora.nombre, fecha: sumarDias(hoy, 3), hora: 20, precio: 90000, metodoPago: 'en-cancha', estado: 'pendiente' },
    { id: 'r-demo-3', canchaId: 'c1', usuarioId: jugadora.id, cliente: jugadora.nombre, fecha: sumarDias(hoy, -3), hora: 19, precio: 60000, metodoPago: 'tarjeta', estado: 'confirmada' },
    { id: 'r-demo-4', canchaId: 'c14', usuarioId: jugadora.id, cliente: jugadora.nombre, fecha: sumarDias(hoy, -8), hora: 18, precio: 45000, metodoPago: 'nequi', estado: 'cancelada' },
  ];

  // Quita las reservas de ejemplo que choquen con las de la jugadora demo.
  const ocupadas = new Set(deLaJugadora.map(r => `${r.canchaId}|${r.fecha}|${r.hora}`));
  return [...reservas.filter(r => !ocupadas.has(`${r.canchaId}|${r.fecha}|${r.hora}`)), ...deLaJugadora];
}
