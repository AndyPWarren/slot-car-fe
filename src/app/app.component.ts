import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AccelerometerService } from './services/accelerometer/accelerometer.service';
import { SocketService } from './services/socket/socket.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    public socketState: boolean;
    public lane: string;
    public message: string;

    constructor(private socketService: SocketService,
                private accelerometerService: AccelerometerService) { }

    ngOnInit(): void {
        this.accelerometerService.watchSensor();
        this.socketService.connected.subscribe((connected) => {
            this.socketState = connected;
        });
        this.socketService.channel.subscribe((channel) => {
            this.lane = channel;
        });
    }

    ngOnDestroy(): void {
        this.accelerometerService.kill();
    }

    trigger(state: boolean) {
        if (state === true) {
            this.accelerometerService.resume();
        } else {
            this.accelerometerService.pause();
        }
    }
}
