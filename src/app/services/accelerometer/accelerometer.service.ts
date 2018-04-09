import { Subscription } from 'rxjs/Subscription';
import { SocketService } from './../socket/socket.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Injectable()
export class AccelerometerService {
    public orientationStream: BehaviorSubject<number> = new BehaviorSubject(0);
    private maxY = 90;
    private cancel$ = new Subject();

    constructor(private socketService: SocketService) {}

    public watchSensor() {
        Observable.fromEvent(window, 'deviceorientation')
            .takeUntil(this.cancel$)
            .subscribe((event: DeviceOrientationEvent) => this.yHandler(event));
    }

    public kill() {
        this.cancel$.next();
    }

    private yHandler(event: DeviceOrientationEvent) {
        const val = this.mapToRange(event.beta, this.maxY);
        this.orientationStream.next(val);
        this.socketService.sendValue(val);
    }

    private mapToRange(val: number, max: number): number {
        return Math.abs(val) / max;
    }
}
