import { environment } from './../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AccelerometerService } from './../accelerometer/accelerometer.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketService {
    private url = `ws://${environment.host}:${environment.port}`;
    private websocket: WebSocket;
    public channel: BehaviorSubject<string> = new BehaviorSubject('');
    public connected: BehaviorSubject<boolean> = new BehaviorSubject(false); 

    constructor() {
        this.connect()
    }

    private connect() {
        this.websocket = new WebSocket(this.url);
        this.websocket.onopen = (evt) => this.onOpen(evt);
        this.websocket.onclose = (evt) => this.onClose(evt);
        this.websocket.onmessage = (evt) => this.onMessage(evt);
        this.websocket.onerror = (evt) => this.onError(evt);
    }

    private onOpen(evt) {
        this.connected.next(true);
        this.log("CONNECTED");
    }

    private onClose(evt) {
        this.connected.next(false);
        this.log("DISCONNECTED");
    }

    private onMessage(evt) {
        const split = evt.data.split('channel=');
        if (split.length > 1) {
            this.channel.next(split[split.length - 1]);
            console.log(this.channel.getValue())
        } else {
            console.log(evt)
        }
    }

    private onError(evt) {
        this.log(evt.data);
    }
    
    private log(message) {
        console.log(message);
    }

    send(message) {
        if (this.connected.getValue() === true) {
            this.websocket.send(message);
        }
    }

    sendValue(value: number) {
        if (this.connected.getValue() === true && this.channel.getValue()) {
            this.websocket.send(`${this.channel.getValue()}=${value}`);
        }
    }
}
