import { SocketService } from './services/socket/socket.service';
import { AccelerometerService } from './services/accelerometer/accelerometer.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule} from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { HttpModule } from '@angular/http';
import { LedsService } from './services/leds/leds.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ColorConstants } from './canvas/color.constants';


@NgModule({
    declarations: [
        AppComponent,
        CanvasComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        MatOptionModule,
        MatSelectModule,
        MatFormFieldModule
    ],
    providers: [
        AccelerometerService,
        SocketService,
        LedsService,
        ColorConstants
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
