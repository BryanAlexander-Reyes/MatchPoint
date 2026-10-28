import { Component, Input } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon';
import { MonedaPipe } from '../../../pipes/moneda.pipe';

// Va dentro del <form> de reservar-cancha: su botón "Confirmar reserva" es de tipo submit.
@Component({
  selector: 'app-resumen-reserva',
  standalone: true,
  imports: [IconComponent, MonedaPipe],
  templateUrl: './resumen-reserva.html',
  styleUrl: './resumen-reserva.css',
})
export class ResumenReserva {
  @Input({ required: true }) cancha: string = '';
  @Input({ required: true }) hora: string = '';
  @Input({ required: true }) fecha: string = '';
  @Input({ required: true }) modalidad: string = '';
  @Input({ required: true }) total: number = 0;
  @Input({ required: true }) precioHora: number = 0;
  @Input({ required: true }) duracion: string = '';
  @Input() procesando: boolean = false;

  tituloResumen: string = 'Resumen de tu reserva';
  textoTotal: string = 'Total a pagar';
  textoBotonConfirmar: string = 'Confirmar reserva';
  textoTerminos: string = 'Al confirmar aceptas nuestros';
}
