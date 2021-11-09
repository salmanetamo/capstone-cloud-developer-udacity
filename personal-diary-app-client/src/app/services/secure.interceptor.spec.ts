import { TestBed } from '@angular/core/testing';

import { SecureInterceptor } from './secure.interceptor';

describe('SecureInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SecureInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SecureInterceptor = TestBed.inject(SecureInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
