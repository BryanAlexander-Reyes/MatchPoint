import { fromReadableStreamLike } from 'rxjs/internal/observable/innerFrom';
import { LoginUserModel } from '../../models/user/model-login'; 
import { Inject, Injectable } from '@angular/core';

interface UsuarioSistemas extends LoginUserModel {
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthServiceLogin {
  private readonly STORAGE_KEY = 'usuarioSesion';

  private usuarioSistemas: UsuarioSistemas[] = [
    {
      nombre: 'brayan reyes',
      correo: 'bryanreyes47k@gmail.com',
      password: '123456',
      rol: 'usuario',
    },
    
  ];

  constructor() {}

  // Metodo para guardar la informacion del usuario

  iniciarSesion(correo:string, password:string):boolean {
    const usuario = this.usuarioSistemas.find((u) => u.correo === correo);
        if (!usuario) {
        return false;
        }
        if (usuario.password !== password) {
        return false;
        }
        const usuarioAuth={
            nombre:usuario.nombre,
            correo:usuario.correo,
            rol:usuario.rol
        }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuarioAuth));
    
    return true;
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // METODO PARA SABER SI ES UN USUARIO AUTENTICADO
  estaAutenticado(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) != null;
  }

  // metodo que obtiene el usuario autenticas
  obtenerUsuario(): LoginUserModel | null {
    const usuario = localStorage.getItem(this.STORAGE_KEY);
    if (!usuario) {
      return null;
    }
    return JSON.parse(usuario);
  }

  // Metodo para obtener el rol

  obtnerRol(): string {
    return this.obtenerUsuario()?.rol ?? '';
  }

  // metodo para obtener nombre
  obtenerNombre(): string {
    return this.obtenerUsuario()?.nombre ?? '';
  }
}