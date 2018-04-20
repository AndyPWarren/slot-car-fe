import { AccelerometerService } from './../services/accelerometer/accelerometer.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MeterComponent } from './../meter/meter.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeComponent } from './gauge.component';
import { Stream } from '../services/accelerometer/stream';

class TestCase {
    input: number;
    expected: number;
}

describe('GaugeComponent', () => {
    let component: GaugeComponent;
    let fixture: ComponentFixture<GaugeComponent>;
    const mockAccelService = {
        orientationStream: new BehaviorSubject<Stream>(new Stream(1, true)),
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GaugeComponent,
                MeterComponent,
            ],
            providers: [
                {
                    provide: AccelerometerService,
                    useValue: mockAccelService
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GaugeComponent);
        component = fixture.componentInstance;
        component.size = 50;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should map to range', () => {
        const cases: TestCase[] = [
            {
                input: 0,
                expected: 45
            },
            {
                input: 0.5,
                expected: 180
            },
            {
                input: 1,
                expected: 315
            }
        ];
        cases.forEach((testCase) => {
            expect(component.mapToRange(testCase.input)).toEqual(testCase.expected);
        });

    });
});
