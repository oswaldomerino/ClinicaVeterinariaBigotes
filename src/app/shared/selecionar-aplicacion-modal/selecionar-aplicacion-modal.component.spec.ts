import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarAplicacionModalComponent } from './selecionar-aplicacion-modal.component';

describe('SelecionarAplicacionModalComponent', () => {
  let component: SelecionarAplicacionModalComponent;
  let fixture: ComponentFixture<SelecionarAplicacionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecionarAplicacionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelecionarAplicacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
