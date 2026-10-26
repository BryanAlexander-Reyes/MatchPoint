import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceLogin } from '../../../service/servicio-user/authServiceLogin';

type PasoRecuperacion = 'correo' | 'codigo' | 'password';

@Component({
  selector: 'app-restablecer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './restablecer.html',
  styleUrl: './restablecer.css',
})
export class Restablecer {
  @Input() embebido = false;
  @Output() irAlLogin = new EventEmitter<void>();

  paso: PasoRecuperacion = 'correo';

  correo: string = '';
  codigo: string = '';
  password: string = '';
  confirmarPassword: string = '';

  showPassword: boolean = false;
  isLoading: boolean = false;

  errorCorreo: string = '';
  errorCodigo: string = '';
  infoCodigo: string = '';
  errorRestablecer: string = '';

  constructor(private router: Router, private authService: AuthServiceLogin) {}

  get pasoActual(): number {
    return this.paso === 'correo' ? 1 : this.paso === 'codigo' ? 2 : 3;
  }

  get passwordsNoCoinciden(): boolean {
    return this.confirmarPassword.length > 0 && this.password !== this.confirmarPassword;
  }

  // PASO 1: solicitar el código de recuperación
  solicitarCodigo(form: any): void {
    if (this.isLoading) return;

    if (form.invalid) {
      this.marcarCampos(form);
      return;
    }

    this.isLoading = true;
    this.errorCorreo = '';

    setTimeout(() => {
      const enviado = this.authService.solicitarRecuperacion(this.correo);
      this.isLoading = false;

      if (!enviado) {
        this.errorCorreo = 'No encontramos una cuenta asociada a este correo.';
        return;
      }

      this.codigo = '';
      this.errorCodigo = '';
      this.paso = 'codigo';
      this.infoCodigo = 'Código enviado. Revisa la consola del navegador (modo demo).';
    }, 800);
  }

  // PASO 2: verificar el código
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
      const valido = this.authService.verificarCodigo(this.codigo);
      this.isLoading = false;

      if (!valido) {
        this.errorCodigo = 'El código es incorrecto o ya expiró. Inténtalo de nuevo.';
        return;
      }

      this.paso = 'password';
    }, 800);
  }

  reenviarCodigo(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorCodigo = '';
    this.infoCodigo = '';

    setTimeout(() => {
      this.authService.solicitarRecuperacion(this.correo);
      this.isLoading = false;
      this.infoCodigo = 'Código reenviado. Revisa la consola del navegador (modo demo).';
    }, 800);
  }

  cambiarCorreo(): void {
    this.paso = 'correo';
    this.codigo = '';
    this.errorCodigo = '';
    this.infoCodigo = '';
  }

  // PASO 3: definir la nueva contraseña
  restablecer(form: any): void {
    if (this.isLoading) return;

    if (form.invalid) {
      this.marcarCampos(form);
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.errorRestablecer = 'Las contraseñas no coinciden.';
      return;
    }

    this.isLoading = true;
    this.errorRestablecer = '';

    setTimeout(() => {
      const actualizado = this.authService.restablecerPassword(this.password);
      this.isLoading = false;

      if (!actualizado) {
        this.errorRestablecer =
          'No se pudo actualizar la contraseña. Solicita un nuevo código.';
        return;
      }

      alert('Contraseña actualizada correctamente. Inicia sesión con tu nueva contraseña.');
      this.volverAlLogin();
    }, 800);
  }

  volverAlLogin(): void {
    this.irAlLogin.emit();
    if (!this.embebido) {
      this.router.navigate(['/login']);
    }
  }

  private marcarCampos(form: any): void {
    Object.values(form.controls).forEach((control: any) => control.markAsTouched());
  }
}
