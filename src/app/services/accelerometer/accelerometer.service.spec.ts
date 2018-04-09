import { SocketService } from './../socket/socket.service';
import { TestBed, inject } from '@angular/core/testing';

import { AccelerometerService } from './accelerometer.service';
import { CLIENT_RENEG_WINDOW } from 'tls';

describe('AccelerometerService', () => {
    let mockSocketService: SocketService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccelerometerService,
                SocketService
            ]
        });
        mockSocketService = TestBed.get(SocketService);
        spyOn(mockSocketService, 'sendValue');
    });

    it('should be created', inject([AccelerometerService], (service: AccelerometerService) => {
        expect(service).toBeTruthy();
    }));

    it('should map the beta value to the range of 0 - 1', inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        let expected: number = null;
        service.orientationStream.subscribe((val) => {
            expected = val;
        });
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 0 }));
        expect(expected).toEqual(1);
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 45 }));
        expect(expected).toEqual(0.5);
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 90 }));
        expect(expected).toEqual(0);
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: -45 }));
        expect(expected).toEqual(0.5);
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: -90 }));
        expect(expected).toEqual(0);
    }));

    it('should send the value to the socket service', inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 0 }));
        expect(mockSocketService.sendValue).toHaveBeenCalledWith(1);
    }));

    it('should stop the subject when kill is called', inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        service.kill();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 0 }));
        expect(mockSocketService.sendValue).not.toHaveBeenCalled();
    }));
});
