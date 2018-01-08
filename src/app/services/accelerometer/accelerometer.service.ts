import { Subscription } from 'rxjs/Subscription';
import { SocketService } from './../socket/socket.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject"

export type Axis = 'x' | 'y';
@Injectable()
export class AccelerometerService {
    private maxX = 90;
    private maxY = 180;
    public orientationStream: BehaviorSubject<number> = new BehaviorSubject(0);
    sub: Subscription
    public _axis: Axis
    constructor(private socketService: SocketService) {
        
    }

    watchSensor() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this._axis === 'x') {
            this.sub = Observable.fromEvent(window, "deviceorientation")
                .subscribe((event: DeviceOrientationEvent) => this.xHandler(event))
        } else {
            this.sub = Observable.fromEvent(window, "deviceorientation")
                .subscribe((event: DeviceOrientationEvent) => this.yHandler(event))
        }
    }

    private xHandler(event: DeviceOrientationEvent) {
        const val = this.mapToRange(event.gamma, this.maxX)
        this.orientationStream.next(val);
        this.socketService.sendValue(val)
    }

    private yHandler(event: DeviceOrientationEvent) {
        const val = this.mapToRange(event.beta, this.maxX)
        this.orientationStream.next(val);
        this.socketService.sendValue(val)
    }

    set axis(axis: Axis) {
        this._axis = axis
        this.watchSensor();
    }

    private mapToRange(val: number, max: number): number {
        return Math.abs(val) / max;
    }
}
