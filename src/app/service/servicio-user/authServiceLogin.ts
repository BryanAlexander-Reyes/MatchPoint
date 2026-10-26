import { Injectable } from '@angular/core';
import { LoginUserModel } from '../../models/user/model-login';

interface UsuarioSistemas extends LoginUserModel {
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthServiceLogin {
  private readonly STORAGE_KEY = 'usuarioSesion';
  private codigoRecuperacion: string | null = null;
  private correoRecuperacion: string | null = null;

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
    const correoNormalizado = correo.trim().toLowerCase();
    const usuario = this.usuarioSistemas.find(
      (u) => u.correo.toLowerCase() === correoNormalizado
    );
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

  // Metodo para registrar un usuario nuevo en memoria
  registrarUsuario(usuario: {
    nombre: string;
    correo: string;
    password: string;
    rol: string;
  }): boolean {
    const correoNormalizado = usuario.correo.trim().toLowerCase();
    const existe = this.usuarioSistemas.some(
      (u) => u.correo.toLowerCase() === correoNormalizado
    );

    if (existe) {
      return false;
    }

    this.usuarioSistemas.push({
      nombre: usuario.nombre.trim(),
      correo: correoNormalizado,
      password: usuario.password,
      rol: usuario.rol,
    });

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

  // METODOS DE RECUPERACION DE CONTRASENA

  // valida que el correo exista y genera un codigo de 6 digitos
  solicitarRecuperacion(correo: string): boolean {
    const correoNormalizado = correo.trim().toLowerCase();
    const usuario = this.usuarioSistemas.find(
      (u) => u.correo.toLowerCase() === correoNormalizado
    );

    if (!usuario) {
      return false;
    }

    this.correoRecuperacion = usuario.correo;
    this.codigoRecuperacion = this.generarCodigo();

    // En un backend real este codigo se envia por correo.
    // En modo demo se imprime en la consola del navegador.
    console.log(
      `[MATCH POINT] Codigo de recuperacion para ${usuario.correo}: ${this.codigoRecuperacion}`
    );

    return true;
  }

  verificarCodigo(codigo: string): boolean {
    return (
      this.codigoRecuperacion !== null &&
      codigo.trim() === this.codigoRecuperacion
    );
  }

  restablecerPassword(nuevaPassword: string): boolean {
    if (!this.correoRecuperacion) {
      return false;
    }

    const usuario = this.usuarioSistemas.find(
      (u) => u.correo === this.correoRecuperacion
    );

    if (!usuario) {
      return false;
    }

    usuario.password = nuevaPassword;
    this.codigoRecuperacion = null;
    this.correoRecuperacion = null;

    return true;
  }

  private generarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}