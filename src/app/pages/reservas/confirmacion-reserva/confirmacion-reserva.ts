import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ReservaModel } from '../../../models/reservas/model-reserva';
import { IconComponent } from '../../../shared/components/icon/icon';
import { MonedaPipe } from '../../../pipes/moneda.pipe';
import { fechaCorta } from '../../../shared/utils/fechas';

@Component({
  selector: 'app-confirmacion-reserva',
  standalone: true,
  imports: [IconComponent, MonedaPipe],
  templateUrl: './confirmacion-reserva.html',
  styleUrl: './confirmacion-reserva.css',
  host: {
    '(document:keydown.escape)': 'cerrar.emit()',
  },
})
export class ConfirmacionReserva implements AfterViewInit {
  @Input({ required: true }) reserva!: ReservaModel;
  @Output() cerrar = new EventEmitter<void>();
  @Output() verReservas = new EventEmitter<void>();

  @ViewChild('btnSeguir') private btnSeguir?: ElementRef<HTMLButtonElement>;

  titulo: string = '¡Reserva confirmada!';
  textoComprobante: string = 'Te enviaremos el comprobante a';
  textoSeguir: string = 'Seguir reservando';
  textoVerReservas: string = 'Ver mis reservas';

  ngAfterViewInit(): void {
    this.btnSeguir?.nativeElement.focus();
  }

  formatearFecha(iso: string): string {
    return fechaCorta(iso);
  }
}
