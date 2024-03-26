import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarServicioModalComponent } from './selecionar-servicio-modal.component';

describe('SelecionarServicioModalComponent', () => {
  let component: SelecionarServicioModalComponent;
  let fixture: ComponentFixture<SelecionarServicioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecionarServicioModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelecionarServicioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
