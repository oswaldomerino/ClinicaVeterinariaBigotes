import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaFormularioComponent } from './mascota-formulario.component';

describe('MascotaFormularioComponent', () => {
  let component: MascotaFormularioComponent;
  let fixture: ComponentFixture<MascotaFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotaFormularioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MascotaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
