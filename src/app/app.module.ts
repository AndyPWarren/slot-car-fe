import { SocketService } from './services/socket/socket.service';
import { AccelerometerService } from './services/accelerometer/accelerometer.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { HttpModule } from '@angular/http';
import { LedsService } from './services/leds/leds.service';
import { ColorConstants } from './canvas/color.constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        CanvasComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        BrowserAnimationsModule,
        MatOptionModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule
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
