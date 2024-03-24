import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotasListaComponent } from './mascotas-lista.component';

describe('MascotasListaComponent', () => {
  let component: MascotasListaComponent;
  let fixture: ComponentFixture<MascotasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotasListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MascotasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
