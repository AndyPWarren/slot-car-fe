import { MeterComponent } from './meter/meter.component';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SocketService } from './services/socket/socket.service';
import { AccelerometerService } from './services/accelerometer/accelerometer.service';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatSliderModule, FormsModule],
            declarations: [
                AppComponent, MeterComponent
            ],
            providers: [SocketService, AccelerometerService]
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        expect(app).toBeTruthy();
    }));
});
