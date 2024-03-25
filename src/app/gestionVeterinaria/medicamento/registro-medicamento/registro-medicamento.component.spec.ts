import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMedicamentoComponent } from './registro-medicamento.component';

describe('RegistroMedicamentoComponent', () => {
  let component: RegistroMedicamentoComponent;
  let fixture: ComponentFixture<RegistroMedicamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroMedicamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroMedicamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
