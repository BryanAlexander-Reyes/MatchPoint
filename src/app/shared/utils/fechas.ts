// Utilidades de fecha para fechas en formato 'YYYY-MM-DD'.

const FORMATO_FECHA_LARGA = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const FORMATO_FECHA_CORTA = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// Se arma la fecha con año/mes/día para evitar el desfase de zona horaria de new Date('YYYY-MM-DD')
export function aFecha(iso: string): Date {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

// '2025-07-30' -> 'Miércoles, 30 de julio de 2025'
export function fechaLarga(iso: string): string {
  const texto = FORMATO_FECHA_LARGA.format(aFecha(iso));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// '2025-07-30' -> '30 de julio de 2025'
export function fechaCorta(iso: string): string {
  return FORMATO_FECHA_CORTA.format(aFecha(iso));
}
