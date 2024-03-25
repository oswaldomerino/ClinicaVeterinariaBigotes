import { TestBed } from '@angular/core/testing';

import { GestionVeterinariaService } from './gestion-veterinaria.service';

describe('GestionVeterinariaService', () => {
  let service: GestionVeterinariaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionVeterinariaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
