import { Pipe, PipeTransform } from '@angular/core';

const FORMATO_NUMERO = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

// 60000 -> "$60.000 COP"
@Pipe({
  name: 'moneda',
  standalone: true,
})
export class MonedaPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return '';
    }
    return `$${FORMATO_NUMERO.format(valor)} COP`;
  }
}
