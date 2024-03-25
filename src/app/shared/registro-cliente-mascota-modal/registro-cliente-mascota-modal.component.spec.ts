import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroClienteMascotaModalComponent } from './registro-cliente-mascota-modal.component';

describe('RegistroClienteMascotaModalComponent', () => {
  let component: RegistroClienteMascotaModalComponent;
  let fixture: ComponentFixture<RegistroClienteMascotaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroClienteMascotaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroClienteMascotaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
