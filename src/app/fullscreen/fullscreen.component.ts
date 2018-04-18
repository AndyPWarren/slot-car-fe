import { Component, OnInit } from '@angular/core';
import fscreen from 'fscreen';

@Component({
    selector: 'app-fullscreen',
    templateUrl: './fullscreen.component.html',
    styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit {
    public fullscreen = false;

    constructor() { }

    ngOnInit() {
        fscreen.addEventListener('fullscreenchange', () => {
            this.fullscreen = !this.fullscreen;
        });
    }

    requestFullscreen() {
        if (!this.fullscreen) {
            fscreen.requestFullscreen(document.documentElement);
        } else {
            fscreen.exitFullscreen();
        }
    }
}
