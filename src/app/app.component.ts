import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AccelerometerService } from './services/accelerometer/accelerometer.service';
import { SocketService } from './services/socket/socket.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { ElementRef } from '@angular/core/src/linker/element_ref';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
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
    }

    ngOnDestroy(): void {
        this.accelerometerService.kill();
    }

    send() {
        this.socketService.sendValue(this.value);
        console.log(this.value);
    }
}
