import { Routes } from '@angular/router';
// import { sintetica } from './pages/canchas/sintetica/sintetica';
import { Animacion } from './pages/user/animacion/animacion';
import { Login } from './pages/user/login/login';
import { Register } from './pages/user/register/register';
import { Restablecer } from './pages/user/restablecer/restablecer';
import { CodigoVerificacion } from './pages/user/codigo-verificacion/codigo-verificacion';

export const routes: Routes = [
    // {
    //     path: 'canchas/micro',
    //     component: sintetica
    // },
    {
        path: '',
        redirectTo: 'animacion',
        pathMatch: 'full'
    },
    {
        path: 'animacion',
        component: Animacion
    },
    {
        path:"login",
        component: Login
    },
    {
        path:"registro",
        component: Register
    },
    {
        path:"verificacion",
        component: CodigoVerificacion
    },
    {
        path:"restablecer",
        component: Restablecer
    },
    {
        path: '**',
        redirectTo: 'animacion'
    }

    
];
