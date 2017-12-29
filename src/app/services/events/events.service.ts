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
@Injectable()
export class EventsService {
    private maxX = 90;
    private maxY = 180;
    public orientationStream: BehaviorSubject<Orientation> = new BehaviorSubject(
        {
            x: {color: 'red', value: 0},
            y: {color: 'green', value: 0}
        }
    );
    constructor() {
        Observable.fromEvent(window, "deviceorientation")
            .subscribe((event: any) => {
                const current = this.orientationStream.getValue();
                current.x.value = this.mapToRange(event.gamma, this.maxX);
                current.y.value = this.mapToRange(event.beta, this.maxY)
                this.orientationStream.next(current);
            });
    }

    private mapToRange(val: number, max: number): number {
        return Math.abs(val) / max
    }
}
