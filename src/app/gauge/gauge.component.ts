import { AccelerometerService } from './../services/accelerometer/accelerometer.service';
import { Component, OnInit, Input, HostBinding } from '@angular/core';

class Range {
    public static MIN = 45;
    public static MAX = 315;
}

@Component({
    selector: 'app-gauge',
    templateUrl: './gauge.component.html',
    styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements OnInit {
    @Input() public size: number;
    @HostBinding('style.height.px') height;
    @HostBinding('style.width.px') width;
    public lineVal = Range.MIN;

    constructor(private accelerometer: AccelerometerService) { }

    ngOnInit() {
        this.accelerometer.orientationStream.subscribe((val) => {
            this.lineVal = this.mapToRange(val);
        });
        this.height = this.size;
        this.width = this.size;
    }

    /**
     * mapToRange
     */
    public mapToRange(val: number): number {
        return val * (Range.MAX - Range.MIN) + Range.MIN;
    }

}
