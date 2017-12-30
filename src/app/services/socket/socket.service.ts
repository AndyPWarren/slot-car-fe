import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Color, AccelerometerService } from './../accelerometer/accelerometer.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketService {
    private url = 'ws://192.168.1.10:9090';
    private websocket: WebSocket;
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
        this.log(evt);
    }

    private onError(evt) {
        this.log(evt.data);
    }
    
    private log(message) {
        console.log(message)
    }

    send(message) {
        if (this.connected.getValue() === true) {
            this.websocket.send(message);
        }
    }

}
