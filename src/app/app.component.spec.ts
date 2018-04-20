import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { GaugeComponent } from './gauge/gauge.component';
import { MeterComponent } from './meter/meter.component';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SocketService } from './services/socket/socket.service';
import { AccelerometerService } from './services/accelerometer/accelerometer.service';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';

describe('AppComponent', () => {
    let fixture;
    let component;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatSliderModule,
                FormsModule
            ],
            declarations: [
                AppComponent,
                GaugeComponent,
                MeterComponent,
                FullscreenComponent
            ],
            providers: [
                {
                    provide: SocketService,
                    useValue: {
                        sendValue: () => {},
                        connected: new Subject(),
                        channel: new Subject()
                    }
                },
                {
                    provide: AccelerometerService,
                    useValue: {
                        watchSensor: jasmine.createSpy('watchSensor'),
                        kill: jasmine.createSpy('kill'),
                        pause: jasmine.createSpy('pause'),
                        resume: jasmine.createSpy('resume'),
                        orientationStream: new Subject()
                    }
                }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    }));
    it('should create the app', async(() => {
        expect(component).toBeTruthy();
    }));
});
