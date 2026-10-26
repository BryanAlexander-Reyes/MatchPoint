import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-codigo-verificacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './codigo-verificacion.html',
  styleUrl: './codigo-verificacion.css',
})
export class CodigoVerificacion {
  @Input() correo: string = '';
  @Output() codigoVerificado = new EventEmitter<void>();
  @Output() cambiarCorreo = new EventEmitter<void>();
  @Output() reenviarCodigo = new EventEmitter<void>();

  // Código de 6 dígitos quemado en TypeScript
  private readonly CODIGO_FIJO = '123456';

  codigo: string = '';
  isLoading: boolean = false;
  errorCodigo: string = '';
  infoCodigo: string = '';

  verificarCodigo(form: any): void {
    if (this.isLoading) return;

    if (form.invalid) {
      this.marcarCampos(form);
      return;
    }

    this.isLoading = true;
    this.errorCodigo = '';
    this.infoCodigo = '';

    setTimeout(() => {
      if (this.codigo.trim() === this.CODIGO_FIJO) {
        this.isLoading = false;
        this.codigoVerificado.emit();
        return;
      }

      this.isLoading = false;
      this.errorCodigo = 'El código es incorrecto. Inténtalo de nuevo.';
    }, 600);
  }

  onCambiarCorreo(): void {
    this.cambiarCorreo.emit();
  }

  onReenviarCodigo(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.errorCodigo = '';
    this.infoCodigo = '';

    setTimeout(() => {
      this.isLoading = false;
      this.infoCodigo = 'Código reenviado. Usa el código: 123456';
    }, 600);
  }

  private marcarCampos(form: any): void {
    Object.values(form.controls).forEach((control: any) => control.markAsTouched());
  }
}
