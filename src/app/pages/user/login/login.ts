import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthServiceLogin } from '../../../service/servicio-user/authServiceLogin';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  @Input() embebido = false;
  @Output() irARegistro = new EventEmitter<void>();
  @Output() abrirRecuperarComponent = new EventEmitter<void>();

  email: string = '';
  password: string = '';
  showPassword = false;
  isLoading = false;

  constructor(private router: Router, private authService: AuthServiceLogin) {}

  abrirRecuperar() {
    this.abrirRecuperarComponent.emit();
    if (!this.embebido) {
      this.router.navigate(['/restablecer']);
    }
  }

  login(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    const autenticado = this.authService.iniciarSesion(this.email, this.password);
    if (!autenticado) {
      this.isLoading = false;
      alert('Correo o contraseña incorrecta');
      return;
    }

    const usuario = this.authService.obtenerUsuario();
    alert(`Bienvenido al sistema ${usuario?.nombre}\nRol: ${usuario?.rol}`);

    this.isLoading = false;
    if (!this.embebido) {
      this.router.navigate(['/home']);
    }
  }

  goToRegister(): void {
    this.irARegistro.emit();
    if (!this.embebido) {
      this.router.navigate(['/registro']);
    }
  }
}