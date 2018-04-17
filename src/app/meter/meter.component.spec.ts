import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterComponent } from './meter.component';
import { AccelerometerService } from '../services/accelerometer/accelerometer.service';
import { SocketService } from '../services/socket/socket.service';

describe('MeterComponent', () => {
    let component: MeterComponent;
    let fixture: ComponentFixture<MeterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MeterComponent],
            providers: [AccelerometerService, SocketService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MeterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
