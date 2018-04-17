import { SocketService } from './../socket/socket.service';
import { TestBed, inject } from '@angular/core/testing';

import { AccelerometerService } from './accelerometer.service';
import { Stream } from './stream';

const dispatchBetaOrientationEvent = (beta: number) => {
    window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta }));
};

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
            expected = val.value;
        });
        service.resume();
        dispatchBetaOrientationEvent(0);

        dispatchBetaOrientationEvent(0);
        expect(expected).toEqual(1);
        dispatchBetaOrientationEvent(45);
        expect(expected).toEqual(0.5);
        dispatchBetaOrientationEvent(90);
        expect(expected).toEqual(0);
    }));

    it('should set values <= 0 to 1', inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        let expected: number = null;
        service.orientationStream.subscribe((val) => {
            expected = val.value;
        });
        service.resume();
        dispatchBetaOrientationEvent(0);

        dispatchBetaOrientationEvent(0);
        expect(expected).toEqual(1);
        dispatchBetaOrientationEvent(-1);
        expect(expected).toEqual(1);
    }));

    it('should set values >= 90 to 0', inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        let expected: number = null;
        service.orientationStream.subscribe((val) => {
            expected = val.value;
        });
        service.resume();
        dispatchBetaOrientationEvent(90);

        dispatchBetaOrientationEvent(90);
        expect(expected).toEqual(0);
        dispatchBetaOrientationEvent(91);
        expect(expected).toEqual(0);
    }));

    it('should send the value to the socket service', inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        service.resume();
        dispatchBetaOrientationEvent(0);

        dispatchBetaOrientationEvent(0);
        expect(sendValueSpy).toHaveBeenCalledWith(1);
    }));

    it('should stop the observables when kill is called', inject([AccelerometerService], (service: AccelerometerService) => {
        let expected: number;
        service.orientationStream.subscribe((e) => {
            expected = e.value;
        });
        service.watchSensor();
        service.resume();
        dispatchBetaOrientationEvent(90);

        dispatchBetaOrientationEvent(90);
        service.kill();
        dispatchBetaOrientationEvent(0);
        expect(expected).toEqual(0);
        expect(sendValueSpy.calls.count()).toEqual(2);
    }));

    it('should start and stop the socket event stream when calling pause and resume',
    inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        service.resume();
        dispatchBetaOrientationEvent(0);

        dispatchBetaOrientationEvent(0);
        expect(sendValueSpy).toHaveBeenCalledWith(1);

        service.pause();
        dispatchBetaOrientationEvent(0);
        dispatchBetaOrientationEvent(45);
        expect(sendValueSpy).toHaveBeenCalledWith(0);

        service.resume();
        dispatchBetaOrientationEvent(0);
        dispatchBetaOrientationEvent(45);
        expect(sendValueSpy).toHaveBeenCalledWith(0.5);
    }));

    it('should keep emitting the orientation stream when calling pause and resume',
    inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        service.resume();
        let expected: number = null;
        service.orientationStream.subscribe((val) => {
            expected = val.value;
        });
        dispatchBetaOrientationEvent(0);

        dispatchBetaOrientationEvent(0);
        expect(expected).toEqual(1);

        service.pause();
        dispatchBetaOrientationEvent(0);
        dispatchBetaOrientationEvent(45);
        expect(expected).toEqual(0.5);

        service.resume();
        dispatchBetaOrientationEvent(0);
        dispatchBetaOrientationEvent(90);
        expect(expected).toEqual(0);
    }));

    it('should send a 0 to the socket when stream is paused',
    inject([AccelerometerService], (service: AccelerometerService) => {
        service.watchSensor();
        service.resume();
        dispatchBetaOrientationEvent(0);

        dispatchBetaOrientationEvent(0);
        expect(sendValueSpy).toHaveBeenCalledWith(1);

        service.pause();
        expect(sendValueSpy).toHaveBeenCalledWith(0);
    }));

    it('should emit a stream event with power set to false if the accelerometer has been paused',
    inject([AccelerometerService], (service: AccelerometerService) => {
        let expected: Stream;
        service.orientationStream.subscribe((stream: Stream) => expected = stream);
        service.watchSensor();
        service.pause();
        dispatchBetaOrientationEvent(0);

        dispatchBetaOrientationEvent(0);
        expect(expected.power).toEqual(false);
    }));

    it('should emit a stream event with power set to true if the accelerometer has been started',
    inject([AccelerometerService], (service: AccelerometerService) => {
        let expected: Stream;
        service.orientationStream.subscribe((stream: Stream) => expected = stream);
        service.watchSensor();
        service.resume();
        dispatchBetaOrientationEvent(0);

        dispatchBetaOrientationEvent(0);
        expect(expected.power).toEqual(true);
    }));
});
