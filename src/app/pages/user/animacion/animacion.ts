import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from '../login/login';
import { Register } from '../register/register';
import { Restablecer } from '../restablecer/restablecer';

type VistaAuth = 'login' | 'registro' | 'restablecer';

@Component({
  selector: 'app-animacion',
  standalone: true,
  imports: [CommonModule, Login, Register, Restablecer],
  templateUrl: './animacion.html',
  styleUrl: './animacion.css',
})
export class Animacion {
  vista: VistaAuth = 'login';

  cambiarVista(vista: VistaAuth): void {
    this.vista = vista;
  }
}
