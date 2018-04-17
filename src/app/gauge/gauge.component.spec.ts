import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeComponent } from './gauge.component';

class TestCase {
    input: number;
    expected: number;
}

describe('GaugeComponent', () => {
    let component: GaugeComponent;
    let fixture: ComponentFixture<GaugeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GaugeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GaugeComponent);
        component = fixture.componentInstance;
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
