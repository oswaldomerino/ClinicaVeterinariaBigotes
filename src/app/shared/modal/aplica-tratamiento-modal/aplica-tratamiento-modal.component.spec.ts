import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicaTratamientoModalComponent } from './aplica-tratamiento-modal.component';

describe('AplicaTratamientoModalComponent', () => {
  let component: AplicaTratamientoModalComponent;
  let fixture: ComponentFixture<AplicaTratamientoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicaTratamientoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AplicaTratamientoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
