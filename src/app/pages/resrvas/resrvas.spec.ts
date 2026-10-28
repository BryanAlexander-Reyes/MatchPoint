import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resrvas } from './resrvas';

describe('Resrvas', () => {
  let component: Resrvas;
  let fixture: ComponentFixture<Resrvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resrvas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Resrvas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
