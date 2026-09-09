import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import  {Router} from '@angular/router'
import { AuthServiceLogin } from '../../../service/servicio-user/authServiceLogin';
import { EventEmitter, Output } from '@angular/core';
import { form } from '@angular/forms/signals';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router:Router, private authService:AuthServiceLogin){}
    @Output() irARegistro = new EventEmitter<void>();
    @Output() abrirRecuperarComponent = new EventEmitter<void>();
    abrirRecuperar(){
        this.abrirRecuperarComponent.emit();
      };
  email:string='';
  password:string='';

  // contraseña y usuario para prueba
  login (): void{

    const autenticado=this.authService.iniciarSesion(this.email, this.password);
    if(!autenticado){
      alert ('Correo o contraseña incorrecta')
      return;
    }
    const usuario=this.authService.obtenerUsuario();
    alert (`Bienvenido al sistema ${usuario?.nombre}\nrol: ${usuario?.rol}`)


    this.router.navigate(['/home'])
  }

  goToRegister():void{
  this.irARegistro.emit();
  }

}
