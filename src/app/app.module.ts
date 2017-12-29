import { EventsService } from './services/events/events.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';


@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [EventsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
