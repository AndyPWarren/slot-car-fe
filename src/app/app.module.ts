import { SocketService } from './services/socket/socket.service';
import { AccelerometerService } from './services/accelerometer/accelerometer.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [AccelerometerService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
