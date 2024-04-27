import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoClienteMascotaComponent } from './info-cliente-mascota.component';

describe('InfoClienteMascotaComponent', () => {
  let component: InfoClienteMascotaComponent;
  let fixture: ComponentFixture<InfoClienteMascotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoClienteMascotaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoClienteMascotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
