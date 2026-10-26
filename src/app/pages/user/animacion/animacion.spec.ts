import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Animacion } from './animacion';

describe('Animacion', () => {
  let component: Animacion;
  let fixture: ComponentFixture<Animacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Animacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Animacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
