import { TestBed } from '@angular/core/testing';

import { SharedDataMedicamentoService } from './shared-data-gestion-veterinaria.service';

describe('SharedDataMedicamentoService', () => {
  let service: SharedDataMedicamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDataMedicamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
