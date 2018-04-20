import { WebSocket } from 'mock-socket';
import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';

import { SocketService } from './socket.service';

describe('SocketService', () => {
    let socketMock;

    beforeEach(() => {
        function WebSocketStub(url: string) {
            socketMock = {
                url: url,
                readyState: WebSocket.CONNECTING,
                send: jasmine.createSpy('send'),
                close: jasmine.createSpy('close').and.callFake
                (function () {
                    socketMock.readyState = WebSocket.CLOSING;
                })
            };
            return socketMock;
        }

        WebSocketStub['OPEN'] = WebSocket.OPEN;
        WebSocketStub['CLOSED'] = WebSocket.CLOSED;

        TestBed.configureTestingModule({
            providers: [
                SocketService,
                {
                    provide: Window,
                    useValue: { WebSocket: WebSocketStub },
                }
            ]
        });
    });

    afterEach(() => {
        socketMock = null;
    });

    it('should be created', inject([SocketService], (service: SocketService) => {
        expect(service).toBeTruthy();
    }));

    describe('sendValue', () => {
        it('should send a message to the channel', inject([SocketService], (service: SocketService) => {
            window.dispatchEvent(new FocusEvent('focus'));
            const chan = '1';
            const val = 0.5;
            service.connected.next(true);
            service.channel.next(chan);
            service.sendValue(0.5);
            expect(socketMock.send).toHaveBeenCalledWith(`${chan}=${val}`);
        }));
    });

    describe('websocket connection', () => {
        it('should connect to the socket when the window receives focus', inject([SocketService], (service: SocketService) => {
            window.dispatchEvent(new FocusEvent('focus'));
            expect(socketMock.url).toEqual('ws://raspberrypi:9090');
        }));

        it('should disconnect the socket when the window receives blur', inject([SocketService], (service: SocketService) => {
            // connect first
            window.dispatchEvent(new FocusEvent('focus'));
            service.connected.next(true);
            // trigger a blur
            window.dispatchEvent(new FocusEvent('blur'));

            expect(socketMock.close).toHaveBeenCalledWith(1000, 'normal');
        }));

        it('should disconnect the socket when the window is unloaded (before page refresh)',
        inject([SocketService], (service: SocketService) => {
            // connect first
            window.dispatchEvent(new FocusEvent('focus'));
            // unload
            window.dispatchEvent(new Event('beforeunload'));

            expect(socketMock.close).toHaveBeenCalledWith(1000, 'normal');
        }));

        it('should connect the socket when the window is loaded',
        inject([SocketService], (service: SocketService) => {
            window.dispatchEvent(new FocusEvent('load'));
            expect(socketMock.url).toEqual('ws://raspberrypi:9090');
        }));
    });

    describe('onMessage', () => {
        it('should set the channel number if it exists',
        inject([SocketService], (service: SocketService) => {
            window.dispatchEvent(new FocusEvent('load'));
            const message = {data: 'channel=1'};
            socketMock.onmessage(message);
            expect(service.channel.getValue()).toEqual('1');
        }));

        it('should not set the channel number if doesnt exist',
        inject([SocketService], (service: SocketService) => {
            window.dispatchEvent(new FocusEvent('load'));
            const message = {data: 'foo=1'};
            socketMock.onmessage(message);
            expect(service.channel.getValue()).toEqual('');
        }));
    });

    describe('open/close', () => {
        it('should set the connected state to true on open',
        inject([SocketService], (service: SocketService) => {
            window.dispatchEvent(new FocusEvent('load'));
            socketMock.onopen();
            expect(service.connected.getValue()).toEqual(true);
        }));

        it('should set the connected state to false on close',
        inject([SocketService], (service: SocketService) => {
            window.dispatchEvent(new FocusEvent('load'));
            socketMock.onopen();
            socketMock.onclose();
            expect(service.connected.getValue()).toEqual(false);
        }));
    });
});
