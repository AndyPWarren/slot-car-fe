import { SocketService } from './../socket/socket.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject"
export class Color {
    color: string;
    value: number;
}
export class Orientation {
    x: Color;
    y: Color;
}
export class Config {
    x: string;
    y: string;
}
@Injectable()
export class AccelerometerService {
    private maxX = 90;
    private maxY = 180;
    private current: Orientation = {
        x: {color: 'red', value: 0},
        y: {color: 'green', value: 0}
    };
    public orientationStream: BehaviorSubject<Orientation> = new BehaviorSubject(this.current);

    constructor(private socketService: SocketService) {
        Observable.fromEvent(window, "deviceorientation")
            .subscribe((event: any) => {
                this.current.x.value = this.mapToRange(event.gamma, this.maxX);
                this.current.y.value = this.mapToRange(event.beta, this.maxY)
                this.orientationStream.next(this.current);
                this.sendToSocket(this.current);
            });
    }

    init(config: Config) {
        this.current = {
            x: {color: config.x, value: 0},
            y: {color: config.y, value: 0}
        }
        console.log(this.current)
    }

    sendToSocket(val: Orientation) {
        this.socketService.send(`${val.x.color}=${val.x.value}`);
        this.socketService.send(`${val.y.color}=${val.y.value}`);
    }

    private mapToRange(val: number, max: number): number {
        return Math.abs(val) / max;
    }
}
