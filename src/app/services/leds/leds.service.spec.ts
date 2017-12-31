import { TestBed, inject } from '@angular/core/testing';

import { LedsService } from './leds.service';

describe('LedsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LedsService]
    });
  });

  it('should be created', inject([LedsService], (service: LedsService) => {
    expect(service).toBeTruthy();
  }));
});
