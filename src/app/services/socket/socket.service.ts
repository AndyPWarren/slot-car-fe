import { inject } from '@angular/core/testing';
import { environment } from './../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AccelerometerService } from './../accelerometer/accelerometer.service';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/merge';

/**
 * Interfaces with the websocket
 * @class SocketService
 */
@Injectable()
export class SocketService {
    /**
     * address for the websocket
     * @property url
     * @private
     */
    private url = `ws://${environment.host}:${environment.port}`;
    /**
     * instance of the websocket
     * @property websocket
     * @private
     */
    private websocket: WebSocket;
    /**
     * The channel to send the message to
     * @property channel
     * @public
     */
    public channel: BehaviorSubject<string> = new BehaviorSubject('');
    /**
     * State of the websocket connection
     * @property connected
     * @public
     */
    public connected: BehaviorSubject<boolean> = new BehaviorSubject(false);

    /**
     * @constructor
     * @param window
     */
    constructor(@Inject(Window) private window) {
        this.manageConnection();
    }

    /**
     * Connect to the socket using the url
     * Setup event handlers
     * @method connect
     * @private
     */
    private connect() {
        this.websocket = new this.window.WebSocket(this.url);
        this.websocket.onopen = (evt) => this.onOpen(evt);
        this.websocket.onclose = (evt) => this.onClose(evt);
        this.websocket.onmessage = (evt) => this.onMessage(evt);
        this.websocket.onerror = (evt) => this.onError(evt);
    }

    private onOpen(evt) {
        this.connected.next(true);
    }

    private onClose(evt) {
        this.connected.next(false);
    }

    private onError(evt) {
        console.error(evt.data);
    }

    /**
     * receive a socket message and set the channel number
     * @method onMessage
     * @param evt socket message
     * @private
     */
    private onMessage(evt) {
        const chanSplit = evt.data.split('channel=');
        if (chanSplit.length > 1) {
            this.channel.next(chanSplit[chanSplit.length - 1]);
        }
    }

    /**
     * close the socket with a 1000 'normal'
     * @method closeSocket
     * @private
     */
    private closeSocket() {
        if (this.websocket) {
            this.websocket.close(1000, 'normal');
        }
    }

    /**
     * Manages the websocket connection
     * It should connect when the page is loaded or when the window has focus
     * It should disconnect when the page is unloaded or the window loses focus
     * @method manageConnection
     * @public
     */
    private manageConnection() {
        const focus$ = Observable.fromEvent(window, 'focus');
        const blur$ = Observable.fromEvent(window, 'blur');
        focus$.merge(blur$)
            .subscribe((event: Event) => {
                const active: boolean = event.type === 'focus';
                if (!active) {
                    this.closeSocket();
                } else {
                    this.connect();
                }
            });
        window.addEventListener('beforeunload', () => this.closeSocket());
        window.addEventListener('load', () => this.connect());
    }

    /**
     * combine a value (0-1) with the channel number and send to the socket
     * e.g. `1=0.5`
     * @method sendValue
     * @param value number to send to the socket
     * @public
     */
    public sendValue(value: number) {
        if (this.connected.getValue() === true && this.channel.getValue()) {
            this.websocket.send(`${this.channel.getValue()}=${value}`);
        }
    }
}
