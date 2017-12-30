import { TestBed, inject } from '@angular/core/testing';

import { AccelerometerService } from './accelerometer.service';

describe('EventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccelerometerService]
    });
  });

  it('should be created', inject([AccelerometerService], (service: AccelerometerService) => {
    expect(service).toBeTruthy();
  }));
});
