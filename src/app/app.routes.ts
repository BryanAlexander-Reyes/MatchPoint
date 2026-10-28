import { Routes } from '@angular/router';
import { ReservarCancha } from './pages/reservas/reservar-cancha/reservar-cancha';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'reservar-cancha/2',
        pathMatch: 'full'
    },
    {
        path: 'reservar-cancha/:canchaId',
        component: ReservarCancha
    },
    {
        path: '**',
        redirectTo: 'reservar-cancha/2'
    }
];
