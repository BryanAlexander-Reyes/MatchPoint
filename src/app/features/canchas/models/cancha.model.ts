import { DeporteId } from './deporte.model';

export interface Cancha {
  id: string;
  nombre: string;
  deporteId: DeporteId;
  empresaId: string;
  zona: string;
  distanciaKm: number;
  precioHora: number;
  calificacion: number;
  numResenas: number;
  tags: string[];
  disponibleAhora: boolean;
  /** true si la cancha pertenece a la empresa con sesión iniciada (vista Empresa) */
  esPropia?: boolean;
}
