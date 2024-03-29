import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosAtendidosComponent } from './servicios-atendidos.component';

describe('ServiciosAtendidosComponent', () => {
  let component: ServiciosAtendidosComponent;
  let fixture: ComponentFixture<ServiciosAtendidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosAtendidosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiciosAtendidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
