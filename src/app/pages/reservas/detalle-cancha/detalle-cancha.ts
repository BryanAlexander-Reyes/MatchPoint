import { Component, Input } from '@angular/core';
import { CanchaModel } from '../../../models/reservas/model-reserva';
import { IconComponent, NombreIcono } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-detalle-cancha',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './detalle-cancha.html',
  styleUrl: './detalle-cancha.css',
})
export class DetalleCancha {
  @Input({ required: true }) cancha!: CanchaModel;

  textoIncluye: string = 'Incluye';
  textoPagoSeguro: string = 'Pago 100% seguro';
  textoDatosProtegidos: string = 'Tus datos están protegidos';

  // Ilustración de respaldo cuando la cancha no tiene foto: franjas del césped y luces del techo
  readonly franjasCesped: string[] = [0, 2, 4, 6, 8, 10].map((i) => {
    const arriba = (n: number) => 34 + (262 / 12) * n;
    const abajo = (n: number) => -90 + (510 / 12) * n;
    return `${arriba(i)},96 ${arriba(i + 1)},96 ${abajo(i + 1)},190 ${abajo(i)},190`;
  });
  readonly luces: number[][] = [[30, 26], [92, 16], [165, 12], [238, 16], [300, 26], [62, 46], [268, 46]];

  get especificaciones(): { icono: NombreIcono; etiqueta: string; valor: string }[] {
    return [
      { icono: 'building', etiqueta: 'Tipo de cancha', valor: `${this.cancha.superficie} - ${this.cancha.cubierta}` },
      { icono: 'ball', etiqueta: 'Modalidad', valor: this.cancha.modalidad },
      { icono: 'ruler', etiqueta: 'Medidas', valor: this.cancha.medidas },
      { icono: 'users', etiqueta: 'Capacidad', valor: `${this.cancha.capacidadMin} - ${this.cancha.capacidadMax} jugadores` },
      { icono: 'bulb', etiqueta: 'Iluminación', valor: this.cancha.iluminacion },
    ];
  }
}
