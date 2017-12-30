import { SocketService } from './services/socket/socket.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/fromEvent"
import { ElementRef } from '@angular/core/src/linker/element_ref';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public socketState: boolean;
    constructor(private socketService: SocketService) {}
    
    ngOnInit(): void {
        this.socketService.connected.subscribe((connected) => {
            this.socketState = connected;
        })
    }
}
