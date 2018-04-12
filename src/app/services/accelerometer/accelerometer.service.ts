import { Subscription } from 'rxjs/Subscription';
import { SocketService } from './../socket/socket.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/never';

@Injectable()
export class AccelerometerService {
    public orientationStream: Subject<number> = new Subject();
    private maxBeta = 90;
    private cancel$ = new Subject();
    private pauser$ = new Subject();

    constructor(private socketService: SocketService) {}

    /**
     * watches the devices orientation stream and processes values from the beta axis
     * sends values to the stream output
     * sends values to the socket when the pauser is true
     * cancelled all subscriptions when cancel is emitted
     * @method watchSensor
     * @public
     */
    public watchSensor() {
        const source$ = Observable.fromEvent(window, 'deviceorientation')
            .map((e: DeviceOrientationEvent) => e.beta)
            .map((e: number) => this.mapOutOfRange(e))
            .map((e: number) => this.mapToRange(e))
            .takeUntil(this.cancel$);

        source$.subscribe((val) => this.orientationStream.next(val));

        this.pauser$
            .switchMap((paused) => paused ? source$ : Observable.never())
            .takeUntil(this.cancel$)
            .subscribe((val: number) => this.socketService.sendValue(val));
    }

    /**
     * cleanup observable subs
     * @method kill
     * @public
     */
    public kill() {
        this.cancel$.next();
    }

    /**
     * prevent values being emitted to the socket,
     * they will still be emitted to the orientationStream
     * @method pause
     * @public
     */
    public pause(): void {
        this.pauser$.next(false);
    }

    /**
     * start sending events to the socket
     * @method resume
     * @public
     */
    public resume(): void {
        this.pauser$.next(true);
    }

    /**
     * set the value of events outside of 0 - 90
     * @method mapOutOfRange
     * @param val
     * @private
     */
    private mapOutOfRange(val: number) {
        if (val <= 0) {
            return 0;
        }
        if (val >= 90) {
            return 90;
        }
        return val;
    }

    /**
     * maps degree range to 0 - 1
     * forming the accelerator values
     * @method mapToRange
     * @param val
     * @private
     */
    private mapToRange(val: number): number {
        return Math.abs((val - this.maxBeta) / this.maxBeta);
    }
}
