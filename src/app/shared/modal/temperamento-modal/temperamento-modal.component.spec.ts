import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperamentoModalComponent } from './temperamento-modal.component';

describe('TemperamentoModalComponent', () => {
  let component: TemperamentoModalComponent;
  let fixture: ComponentFixture<TemperamentoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemperamentoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemperamentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
