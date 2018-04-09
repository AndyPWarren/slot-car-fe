import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasComponent } from './canvas.component';
import { AccelerometerService } from '../services/accelerometer/accelerometer.service';
import { SocketService } from '../services/socket/socket.service';
import { ColorConstants } from './color.constants';

describe('CanvasComponent', () => {
    let component: CanvasComponent;
    let fixture: ComponentFixture<CanvasComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CanvasComponent],
            providers: [AccelerometerService, SocketService, ColorConstants]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CanvasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
