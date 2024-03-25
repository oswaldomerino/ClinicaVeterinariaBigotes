import { TestBed } from '@angular/core/testing';

import { SalaEsperaService } from './sala-espera.service';

describe('SalaEsperaService', () => {
  let service: SalaEsperaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaEsperaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
