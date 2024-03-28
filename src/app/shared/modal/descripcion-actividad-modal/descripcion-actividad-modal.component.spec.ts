import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescripcionActividadModalComponent } from './descripcion-actividad-modal.component';

describe('DescripcionActividadModalComponent', () => {
  let component: DescripcionActividadModalComponent;
  let fixture: ComponentFixture<DescripcionActividadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescripcionActividadModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DescripcionActividadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
