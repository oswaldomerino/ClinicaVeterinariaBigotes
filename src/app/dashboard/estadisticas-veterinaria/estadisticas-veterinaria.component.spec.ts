import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasVeterinariaComponent } from './estadisticas-veterinaria.component';

describe('EstadisticasVeterinariaComponent', () => {
  let component: EstadisticasVeterinariaComponent;
  let fixture: ComponentFixture<EstadisticasVeterinariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasVeterinariaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstadisticasVeterinariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
