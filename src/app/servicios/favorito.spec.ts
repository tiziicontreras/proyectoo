import { TestBed } from '@angular/core/testing';

import { FavoritoService } from './favoritoService';

describe('Favorito', () => {
  let service: FavoritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
