import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsteticaComponent } from './estetica.component';

describe('EsteticaComponent', () => {
  let component: EsteticaComponent;
  let fixture: ComponentFixture<EsteticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsteticaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EsteticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
