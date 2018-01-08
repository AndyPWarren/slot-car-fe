import { AccelerometerService, Axis } from './services/accelerometer/accelerometer.service';
import { LedsService } from './services/leds/leds.service';
import { SocketService } from './services/socket/socket.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/fromEvent"
import { ElementRef } from '@angular/core/src/linker/element_ref';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public socketState: boolean;
    public lane: string;
    public controlAxis: Axis[] = ['x', 'y'];
    public selectedControlAxis: Axis = this.controlAxis[1];
    public value = 0;

    public message: string

    constructor(private socketService: SocketService,
        private ledsService: LedsService,
        private accelerometerService: AccelerometerService) { }

    ngOnInit(): void {
        this.socketService.connected.subscribe((connected) => {
            this.socketState = connected;
        });
        this.socketService.channel.subscribe((channel) => {
            this.lane = channel;
        });
        this.setConfig();
    }

    setConfig() {
        console.log('setting config axis is', this.selectedControlAxis)
        this.accelerometerService.axis = this.selectedControlAxis;
    }

    send() {
        console.log(this.value)
        this.socketService.sendValue(this.value);
    }
}
