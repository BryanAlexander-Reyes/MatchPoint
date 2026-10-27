import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['correo']) {
        this.correo = params['correo'];
      }
    });
  }

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
        alert('Código verificado correctamente. Registro completado.');
        this.router.navigate(['/login']);
        this.codigoVerificado.emit();
        return;
      }

      this.isLoading = false;
      this.errorCodigo = 'El código es incorrecto. Inténtalo de nuevo.';
    }, 600);
  }

  onCambiarCorreo(): void {
    this.router.navigate(['/registro']);
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
