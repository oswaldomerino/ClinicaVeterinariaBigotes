import { TestBed } from '@angular/core/testing';

import { SharedDataGestionVeterinariaService } from './shared-data-gestion-veterinaria.service';

describe('SharedDataMedicamentoService', () => {
  let service: SharedDataGestionVeterinariaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDataGestionVeterinariaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
