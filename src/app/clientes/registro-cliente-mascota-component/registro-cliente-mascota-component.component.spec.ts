import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroClienteMascotaComponentComponent } from './registro-cliente-mascota-component.component';

describe('RegistroClienteMascotaComponentComponent', () => {
  let component: RegistroClienteMascotaComponentComponent;
  let fixture: ComponentFixture<RegistroClienteMascotaComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroClienteMascotaComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroClienteMascotaComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
