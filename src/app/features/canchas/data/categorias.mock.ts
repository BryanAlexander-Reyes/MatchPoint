import { DeporteId } from '../models/deporte.model';
import { CategoriaBanner } from '../models/categoria-banner.model';

/** URL de la foto de portada de cada deporte (también reutilizada en las tarjetas del grid). */
export const IMAGEN_POR_DEPORTE: Record<DeporteId, string> = {
  futbol: 'https://images.unsplash.com/photo-1694866839396-fafc76941831',
  voley: 'https://images.unsplash.com/photo-1530869685324-333806073961',
  baloncesto: 'https://images.unsplash.com/photo-1500591844910-55dd3262d160',
  tenis: 'https://images.unsplash.com/photo-1678734491865-d4dc8a5f5399',
  padel: 'https://images.pexels.com/photos/32897040/pexels-photo-32897040.jpeg',
};

const IMAGEN_TODOS = 'https://images.unsplash.com/photo-1510195863256-4c30fc142b3d';

export const BANNERS_POR_DEPORTE: Record<DeporteId, CategoriaBanner> = {
  futbol: {
    titulo: 'Canchas de Fútbol',
    descripcion: 'Sintética, techada o al aire libre: encuentra tu cancha para el partido de hoy.',
    imagen: IMAGEN_POR_DEPORTE.futbol,
    caracteristicas: [
      { icono: 'cancha', titulo: 'Césped de calidad', subtitulo: 'Sintético o natural' },
      { icono: 'led', titulo: 'Iluminación LED', subtitulo: 'Juega de noche' },
      { icono: 'parqueadero', titulo: 'Parqueadero', subtitulo: 'Llega en carro' },
      { icono: 'reserva', titulo: 'Reserva fácil', subtitulo: 'En pocos pasos' },
    ],
  },
  voley: {
    titulo: 'Canchas de Vóley Playa',
    descripcion: 'Disfruta del sol, la arena y el mejor ambiente para jugar tu deporte favorito.',
    imagen: IMAGEN_POR_DEPORTE.voley,
    caracteristicas: [
      { icono: 'playa', titulo: 'Ambiente playero', subtitulo: 'Vive la experiencia' },
      { icono: 'cancha', titulo: 'Canchas premium', subtitulo: 'Arena de calidad' },
      { icono: 'duchas', titulo: 'Servicios completos', subtitulo: 'Duchas y más' },
      { icono: 'reserva', titulo: 'Reserva fácil', subtitulo: 'En pocos pasos' },
    ],
  },
  baloncesto: {
    titulo: 'Canchas de Baloncesto',
    descripcion: 'Tableros profesionales y buen piso para tu próximo partido de básquet.',
    imagen: IMAGEN_POR_DEPORTE.baloncesto,
    caracteristicas: [
      { icono: 'techada', titulo: 'Cancha techada', subtitulo: 'Juega bajo techo' },
      { icono: 'cancha', titulo: 'Tableros profesionales', subtitulo: 'Calidad de juego' },
      { icono: 'vestidores', titulo: 'Vestidores', subtitulo: 'Cambio cómodo' },
      { icono: 'reserva', titulo: 'Reserva fácil', subtitulo: 'En pocos pasos' },
    ],
  },
  tenis: {
    titulo: 'Canchas de Tenis',
    descripcion: 'Superficies profesionales para jugar individual o dobles a cualquier hora.',
    imagen: IMAGEN_POR_DEPORTE.tenis,
    caracteristicas: [
      { icono: 'cancha', titulo: 'Superficie profesional', subtitulo: 'Rápida y pareja' },
      { icono: 'led', titulo: 'Iluminación nocturna', subtitulo: 'Juega de noche' },
      { icono: 'parqueadero', titulo: 'Parqueadero', subtitulo: 'Llega en carro' },
      { icono: 'reserva', titulo: 'Reserva fácil', subtitulo: 'En pocos pasos' },
    ],
  },
  padel: {
    titulo: 'Canchas de Pádel',
    descripcion: 'Paredes de cristal y el estándar internacional para tu partido de pádel.',
    imagen: IMAGEN_POR_DEPORTE.padel,
    caracteristicas: [
      { icono: 'cancha', titulo: 'Paredes de cristal', subtitulo: 'Estándar internacional' },
      { icono: 'cafeteria', titulo: 'Cafetería', subtitulo: 'Descansa entre sets' },
      { icono: 'parqueadero', titulo: 'Parqueadero', subtitulo: 'Llega en carro' },
      { icono: 'reserva', titulo: 'Reserva fácil', subtitulo: 'En pocos pasos' },
    ],
  },
};

export const BANNER_TODOS: CategoriaBanner = {
  titulo: 'Todas las canchas',
  descripcion: 'Miles de canchas en Yopal: fútbol, vóley playa, baloncesto, tenis y pádel en un solo lugar.',
  imagen: IMAGEN_TODOS,
  caracteristicas: [
    { icono: 'cancha', titulo: 'Miles de canchas', subtitulo: 'En tu ciudad' },
    { icono: 'reserva', titulo: 'Reserva fácil', subtitulo: 'Rápida y sin líos' },
    { icono: 'pago', titulo: 'Pago seguro', subtitulo: 'En línea' },
    { icono: 'soporte', titulo: 'Soporte 24/7', subtitulo: 'Siempre disponible' },
  ],
};
