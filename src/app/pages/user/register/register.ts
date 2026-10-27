import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthServiceLogin } from '../../../service/servicio-user/authServiceLogin';
import { CodigoVerificacion } from '../codigo-verificacion/codigo-verificacion';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, CodigoVerificacion],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  @Input() embebido = false;
  @Output() irAlogin = new EventEmitter<void>();

  // Campos básicos solicitados
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  cedula: string = '';
  tipoDocumento: string = '';
  fechaNacimiento: string = '';
  rol: string = 'usuario';

  showPassword: boolean = false;
  password: string = '';
  confirmarPassword: string = '';

  isLoading: boolean = false;
  mostrarVerificacion: boolean = false;

  tiposDocumento = [
    { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
    { value: 'CE', label: 'Cédula de Extranjería (CE)' },
    { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
    { value: 'PAS', label: 'Pasaporte (PAS)' }
  ];

  roles = [
    { value: 'usuario', label: 'Usuario' },
    { value: 'propietario', label: 'Propietario' }
  ];

  constructor(private router: Router, private authService: AuthServiceLogin) {}

  aceptarTerminos: boolean = false;

  registrar(form: any): void {
    if (form.invalid || this.isLoading) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      return;
    }

    if (this.password !== this.confirmarPassword) {
      form.controls['confirmarPassword']?.markAsTouched();
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!this.aceptarTerminos) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    this.isLoading = true;

    const usuarioRegistro = {
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      cedula: this.cedula,
      tipoDocumento: this.tipoDocumento,
      fechaNacimiento: this.fechaNacimiento,
      rol: this.rol
    };

    console.log('Registro de usuario:', JSON.stringify(usuarioRegistro, null, 2));

    const registrado = this.authService.registrarUsuario({
      nombre: `${this.nombre} ${this.apellido}`.trim(),
      correo: this.correo,
      password: this.password,
      rol: this.rol
    });

    if (!registrado) {
      this.isLoading = false;
      alert('Ya existe una cuenta registrada con este correo.');
      return;
    }

    setTimeout(() => {
      this.isLoading = false;
      this.mostrarVerificacion = true;
    }, 800);
  }

  irALogin(): void {
    this.irAlogin.emit();
    if (!this.embebido) {
      this.router.navigate(['/login']);
    }
  }
}
