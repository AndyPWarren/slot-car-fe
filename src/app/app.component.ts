import { Component, OnInit, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/fromEvent"
import { ElementRef } from '@angular/core/src/linker/element_ref';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    private maxX = 90;
    private maxY = 180;
    public event: Observable<number>;
    ngOnInit(): void {
        
        this.event = Observable.fromEvent(window, "deviceorientation")
        this.event.subscribe((event: any) => {
            const x = event.gamma;
            const y = event.beta;
            console.log(this.mapToRange(x, this.maxX))
        });
    }

    private mapToRange(val: number, max: number): number {
        return Math.abs(val) / max
    }
}
