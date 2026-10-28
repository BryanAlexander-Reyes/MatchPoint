import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ReservarCancha } from './reservar-cancha';

describe('ReservarCancha', () => {
  let component: ReservarCancha;
  let fixture: ComponentFixture<ReservarCancha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservarCancha],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservarCancha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carga la cancha 2 por defecto con una hora preseleccionada', () => {
    expect(component.cancha.nombre).toBe('Cancha 2');
    expect(component.hora).not.toBe('');
  });

  it('no deja confirmar sin horario', () => {
    component.hora = '';
    component.confirmar();
    expect(component.errores.hora).toBeTruthy();
  });
});
