import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoMedicamentoComponent } from './catalogo-medicamento.component';

describe('CatalogoMedicamentoComponent', () => {
  let component: CatalogoMedicamentoComponent;
  let fixture: ComponentFixture<CatalogoMedicamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoMedicamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalogoMedicamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
