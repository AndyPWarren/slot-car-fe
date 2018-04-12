import { SocketService } from './../socket/socket.service';
import { TestBed, inject } from '@angular/core/testing';

import { AccelerometerService } from './accelerometer.service';

describe('AccelerometerService', () => {
    let mockSocketService: SocketService;
    let sendValueSpy;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccelerometerService,
                SocketService
            ]
        });
        mockSocketService = TestBed.get(SocketService);
        sendValueSpy = spyOn(mockSocketService, 'sendValue');
    });

    it('should be created', inject([AccelerometerService], (service: AccelerometerService) => {
        expect(service).toBeTruthy();
    }));

    it('should map the beta values to the range of 0 - 1', inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        let expected: number = null;
        service.orientationStream.subscribe((val) => {
            expected = val;
        });
        service.resume();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 0 }));
        expect(expected).toEqual(1);
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 45 }));
        expect(expected).toEqual(0.5);
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 90 }));
        expect(expected).toEqual(0);
    }));

    it('should set values <= 0 to 1', inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        let expected: number = null;
        service.orientationStream.subscribe((val) => {
            expected = val;
        });
        service.resume();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 0 }));
        expect(expected).toEqual(1);
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: -1 }));
        expect(expected).toEqual(1);
    }));

    it('should set values >= 90 to 0', inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        let expected: number = null;
        service.orientationStream.subscribe((val) => {
            expected = val;
        });
        service.resume();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 90 }));
        expect(expected).toEqual(0);
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 91 }));
        expect(expected).toEqual(0);
    }));

    it('should send the value to the socket service', inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        service.resume();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 0 }));
        expect(sendValueSpy).toHaveBeenCalledWith(1);
    }));

    it('should stop the observables when kill is called', inject([AccelerometerService], (service: AccelerometerService) => {
        let expected: number;
        service.orientationStream.subscribe((e) => {
            expected = e;
        });
        service.watchSensor();
        service.resume();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 90 }));
        service.kill();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 0 }));
        expect(expected).toEqual(0);
        expect(sendValueSpy.calls.count()).toEqual(1);
    }));

    it('should start and stop the socket event stream when calling pause and resume',
    inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        service.resume();

        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 0 }));
        expect(sendValueSpy).toHaveBeenCalledWith(1);
        expect(sendValueSpy.calls.count()).toEqual(1);

        service.pause();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 45 }));
        expect(sendValueSpy.calls.count()).toEqual(1);

        service.resume();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 90 }));
        expect(sendValueSpy).toHaveBeenCalledWith(0);
        expect(sendValueSpy.calls.count()).toEqual(2);
    }));

    it('should keep emitting the orientation stream when calling pause and resume',
    inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        service.resume();
        let expected: number = null;
        service.orientationStream.subscribe((val) => {
            expected = val;
        });
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 0 }));
        expect(expected).toEqual(1);

        service.pause();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 45 }));
        expect(expected).toEqual(0.5);

        service.resume();
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 90 }));
        expect(expected).toEqual(0);
    }));
});
