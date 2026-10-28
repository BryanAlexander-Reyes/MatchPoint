export type EstadoFranja = 'disponible' | 'reservada' | 'no-disponible';
export type EstadoReserva = 'Confirmada' | 'Cancelada';

export interface CanchaModel {
  id: number;
  nombre: string;
  imagen: string | null; // Ruta a la foto real, ej: 'img/cancha-2.jpg'. Si es null se dibuja una ilustración.
  superficie: string;
  cubierta: string;
  modalidad: string;
  descripcion: string;
  medidas: string;
  capacidadMin: number;
  capacidadMax: number;
  iluminacion: string;
  precioHora: number;
  incluye: string[];
}

export interface FranjaModel {
  inicio: string; // '08:00'
  fin: string; // '09:00'
  estado: EstadoFranja;
}

export interface ReservaModel {
  codigo: string;
  canchaId: number;
  cancha: string;
  fecha: string; // 'YYYY-MM-DD'
  horaInicio: string;
  horaFin: string;
  modalidad: string;
  responsable: string;
  correo: string;
  jugadores: number;
  equipoPropio: boolean;
  notas: string;
  total: number;
  estado: EstadoReserva;
  creadaEn: string;
}

// Mismos campos que LoginUserModel (models/user/model-login.ts en Dev_b).
// TODO: usar LoginUserModel cuando se una la rama del módulo usuario.
export interface UsuarioReservaModel {
  nombre: string;
  correo: string;
  rol: string;
}
