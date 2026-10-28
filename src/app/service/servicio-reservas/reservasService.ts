import { Injectable } from '@angular/core';
import {
  CanchaModel,
  EstadoFranja,
  FranjaModel,
  ReservaModel,
  UsuarioReservaModel,
} from '../../models/reservas/model-reserva';

const STORAGE_KEY = 'matchpoint_reservas';

const INCLUYE_BASICO = [
  'Uso de la cancha completa',
  'Balón de fútbol',
  'Marcador digital',
  'Iluminación',
  'Parqueadero gratuito',
];

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  // TODO: reemplazar por llamadas HTTP al backend real cuando esté listo.

  // =========================
  // REGLAS DEL NEGOCIO
  // =========================

  readonly hoy: string = '2025-07-30'; // "Hoy" simulado para la maqueta
  readonly diasMaxAnticipacion: number = 30;
  readonly horaApertura: number = 8; // Primer turno: 08:00 - 09:00
  readonly horaCierre: number = 20; // Último turno: 19:00 - 20:00
  readonly duracionHoras: number = 1;

  // TODO: tomar el usuario de AuthServiceLogin (rama Dev_b) cuando se una el módulo usuario.
  readonly usuario: UsuarioReservaModel = {
    nombre: 'Juan Pérez',
    correo: 'juanperez@mail.com',
    rol: 'usuario',
  };

  readonly modalidades: string[] = ['Fútbol 5v5', 'Fútbol 6v6', 'Fútbol 7v7'];

  // =========================
  // DATOS QUEMADOS
  // =========================

  canchas: CanchaModel[] = [
    {
      id: 1,
      nombre: 'Cancha 1',
      imagen: null,
      superficie: 'Sintético',
      cubierta: 'Techada',
      modalidad: 'Fútbol 5v5',
      descripcion: 'Cancha techada ideal para partidos rápidos y entrenamientos.',
      medidas: '25m x 16m',
      capacidadMin: 10,
      capacidadMax: 12,
      iluminacion: 'LED de alta calidad',
      precioHora: 50000,
      incluye: INCLUYE_BASICO,
    },
    {
      id: 2,
      nombre: 'Cancha 2',
      imagen: null,
      superficie: 'Sintético',
      cubierta: 'Techada',
      modalidad: 'Fútbol 5v5',
      descripcion: 'Espacio cómodo y seguro para disfrutar con tu equipo.',
      medidas: '25m x 16m',
      capacidadMin: 10,
      capacidadMax: 12,
      iluminacion: 'LED de alta calidad',
      precioHora: 60000,
      incluye: INCLUYE_BASICO,
    },
    {
      id: 3,
      nombre: 'Cancha 3',
      imagen: null,
      superficie: 'Sintético',
      cubierta: 'Aire libre',
      modalidad: 'Fútbol 5v5',
      descripcion: 'Cancha amplia al aire libre para partidos más exigentes.',
      medidas: '30m x 18m',
      capacidadMin: 10,
      capacidadMax: 14,
      iluminacion: 'Reflectores LED',
      precioHora: 70000,
      incluye: INCLUYE_BASICO,
    },
    {
      id: 4,
      nombre: 'Cancha 4',
      imagen: null,
      superficie: 'Sintético',
      cubierta: 'Techada',
      modalidad: 'Fútbol 7v7',
      descripcion: 'Iluminación profesional y superficie de alta calidad.',
      medidas: '40m x 25m',
      capacidadMin: 14,
      capacidadMax: 18,
      iluminacion: 'LED profesional',
      precioHora: 65000,
      incluye: INCLUYE_BASICO,
    },
  ];

  // Un estado por franja, en orden desde horaApertura. La clave es 'canchaId|fecha'.
  // Las combinaciones que no estén aquí se generan solas (ver generarDisponibilidad).
  private disponibilidad: Record<string, EstadoFranja[]> = {
    '2|2025-07-30': [
      'disponible', 'reservada', 'no-disponible', 'disponible', 'reservada', 'no-disponible',
      'disponible', 'reservada', 'disponible', 'disponible', 'reservada', 'no-disponible',
    ],
    '2|2025-07-31': [
      'reservada', 'disponible', 'disponible', 'no-disponible', 'disponible', 'reservada',
      'reservada', 'disponible', 'disponible', 'reservada', 'reservada', 'disponible',
    ],
    '2|2025-08-01': [
      'disponible', 'disponible', 'reservada', 'reservada', 'no-disponible', 'disponible',
      'disponible', 'disponible', 'reservada', 'reservada', 'reservada', 'reservada',
    ],
  };

  // Reservas hechas por el usuario (se guardan en localStorage)
  reservas: ReservaModel[] = [];

  constructor() {
    try {
      const guardadas = localStorage.getItem(STORAGE_KEY);
      if (guardadas) {
        const reservas = JSON.parse(guardadas) as ReservaModel[];
        if (Array.isArray(reservas)) this.reservas = reservas;
      }
    } catch {
      // Si el almacenamiento no está disponible, se arranca sin reservas.
    }
  }

  // =========================
  // CONSULTAS
  // =========================

  obtenerCancha(id: number): CanchaModel | undefined {
    return this.canchas.find((cancha) => cancha.id === id);
  }

  /** Franjas del día con su estado, ya teniendo en cuenta las reservas del usuario. */
  obtenerFranjas(canchaId: number, fecha: string): FranjaModel[] {
    const clave = `${canchaId}|${fecha}`;
    if (!this.disponibilidad[clave]) {
      this.disponibilidad[clave] = this.generarDisponibilidad(clave);
    }

    const reservadas = this.reservas
      .filter((r) => r.canchaId === canchaId && r.fecha === fecha && r.estado === 'Confirmada')
      .map((r) => r.horaInicio);

    return this.disponibilidad[clave].map((estado, i) => {
      const inicio = `${pad(this.horaApertura + i)}:00`;
      return {
        inicio,
        fin: this.calcularHoraFin(inicio),
        estado: reservadas.includes(inicio) ? 'reservada' : estado,
      };
    });
  }

  estaDisponible(canchaId: number, fecha: string, inicio: string): boolean {
    return this.obtenerFranjas(canchaId, fecha).some(
      (franja) => franja.inicio === inicio && franja.estado === 'disponible'
    );
  }

  calcularHoraFin(inicio: string): string {
    return `${pad(Number(inicio.slice(0, 2)) + this.duracionHoras)}:00`;
  }

  /** Última fecha que se puede reservar (hoy + diasMaxAnticipacion). */
  get fechaMaxima(): string {
    const [anio, mes, dia] = this.hoy.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia + this.diasMaxAnticipacion);
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
  }

  // =========================
  // ACCIONES
  // =========================

  agregarReserva(reserva: ReservaModel): void {
    this.reservas.unshift(reserva);
    this.guardar();
  }

  generarCodigo(): string {
    return 'RES-' + Date.now().toString(36).slice(-6).toUpperCase();
  }

  // =========================
  // PRIVADOS
  // =========================

  // Disponibilidad "aleatoria" pero estable: la misma clave siempre da el mismo resultado.
  private generarDisponibilidad(clave: string): EstadoFranja[] {
    let semilla = [...clave].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) % 233280, 7);
    const azar = () => (semilla = (semilla * 9301 + 49297) % 233280) / 233280;

    return Array.from({ length: this.horaCierre - this.horaApertura }, () => {
      const r = azar();
      if (r < 0.55) return 'disponible';
      if (r < 0.85) return 'reservada';
      return 'no-disponible';
    });
  }

  private guardar(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reservas));
    } catch {
      // La pantalla sigue funcionando durante la sesión aunque no pueda persistir.
    }
  }
}

function pad(numero: number): string {
  return String(numero).padStart(2, '0');
}
