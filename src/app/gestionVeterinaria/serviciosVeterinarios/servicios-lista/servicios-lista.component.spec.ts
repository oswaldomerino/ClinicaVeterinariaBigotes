import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosListaComponent } from './servicios-lista.component';

describe('ServiciosListaComponent', () => {
  let component: ServiciosListaComponent;
  let fixture: ComponentFixture<ServiciosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiciosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
