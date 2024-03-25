import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarClienteMascotaModalComponent } from './selecionar-cliente-mascota-modal.component';

describe('SelecionarClienteMascotaModalComponent', () => {
  let component: SelecionarClienteMascotaModalComponent;
  let fixture: ComponentFixture<SelecionarClienteMascotaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecionarClienteMascotaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelecionarClienteMascotaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
