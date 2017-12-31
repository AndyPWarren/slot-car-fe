import { AccelerometerService } from './services/accelerometer/accelerometer.service';
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
    public leds: string[];
    public x: string;
    public y: string;

    constructor(private socketService: SocketService,
        private ledsService: LedsService,
        private accelerometerService: AccelerometerService) { }

    ngOnInit(): void {
        this.socketService.connected.subscribe((connected) => {
            this.socketState = connected;
        });
        this.ledsService.get().then((res) => {
            this.leds = res;
            this.x = this.leds[0];
            this.y = this.leds[1];
            this.setConfig();
        })
    }

    setConfig() {
        console.log('setting config')
        this.accelerometerService.init({
            x: this.x,
            y: this.y
        });
    }
}
