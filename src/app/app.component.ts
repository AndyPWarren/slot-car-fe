import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AccelerometerService } from './services/accelerometer/accelerometer.service';
import { SocketService } from './services/socket/socket.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import fscreen from 'fscreen';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    public socketState: boolean;
    public lane: string;
    public value = 0;

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
        this.accelerometerService.orientationStream.subscribe((val) => this.value = val);
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

    send() {
        this.socketService.sendValue(this.value);
        console.log(this.value);
    }

    requestFullscreen() {
        fscreen.requestFullscreen(document.documentElement);
    }
}
