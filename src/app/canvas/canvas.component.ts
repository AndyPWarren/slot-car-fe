import { AccelerometerService } from './../services/accelerometer/accelerometer.service';
import { Observable } from 'rxjs/Observable';
import { Component, ViewChild, ElementRef, AfterViewInit, Input, OnInit } from '@angular/core';
import "rxjs/add/observable/timer";
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { ColorConstants } from './color.constants';
class Pos {
    x: number;
    y: number;
}
@Component({
    selector: 'app-canvas',
    template: '<div class="canvas-wrapper" #wrapper><canvas #canvas></canvas></div>',
    styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
    
    @ViewChild('wrapper') public wrapper: ElementRef;
    @ViewChild('canvas') public canvas: ElementRef;
    private canvasEl: HTMLCanvasElement;
    private rect: ClientRect;
    private cx: CanvasRenderingContext2D;
    private prevPos: Pos;
    private xIndex = 0
    private accelerometerSub: Subscription;

    constructor(private accelerometerService: AccelerometerService,
        private colors: ColorConstants) { }

    ngAfterViewInit(): void {
        this.createCanvas();
        const initPos: Pos = { x: 0, y: this.rect.height }
        this.prevPos = initPos;
        this.accelerometerSub = this.accelerometerService.orientationStream.subscribe((event) => this.accelerometerHandler(event));
    }

    ngOnDestroy(): void {
        this.accelerometerSub.unsubscribe();
    }

    accelerometerHandler(event: number) {
        const current = this.createCurrentPos(event)
        this.drawOnCanvas(current, this.prevPos);
        if (this.xIndex === this.canvasEl.width) {
            this.resizeCanvasWidth(this.canvasEl.width + this.wrapper.nativeElement.clientWidth);
        }
        this.xIndex += 1;
        this.prevPos = current;
    }

    createCurrentPos(y: number): Pos {
        return {
            x: this.xIndex,
            y: y * this.rect.height,
        };
    }

    createCanvas() {
        this.canvasEl = this.canvas.nativeElement;
        this.cx = this.canvasEl.getContext('2d');
        this.cx.lineWidth = 1;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000';
        this.canvasEl.width = this.wrapper.nativeElement.clientWidth;
        this.rect = this.canvasEl.getBoundingClientRect();
    }

    scrollWrapper() {
        const wrapperEl: HTMLElement = this.wrapper.nativeElement
        wrapperEl.scrollBy(this.wrapper.nativeElement.clientWidth, 0)
    }

    resizeCanvasWidth(w: number) {
        // cache the current canvas
        const tempCanvas = document.createElement('canvas');
        const tempCx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvasEl.width;
        tempCanvas.height = this.canvasEl.height;
        tempCx.drawImage(this.canvasEl, 0, 0);
        // perform resize
        this.canvasEl.width = w;
        // apply cache
        this.cx.drawImage(tempCanvas, 0, 0);
        this.scrollWrapper();
    }

    drawOnCanvas(currentPos: Pos, prevPos: Pos) {
        this.cx.beginPath();
        // we're drawing lines so we need a previous position
        if (prevPos) {
            // sets the start point
            this.cx.moveTo(prevPos.x, prevPos.y); // from
            // draws a line from the start pos until the current position
            this.cx.lineTo(currentPos.x, currentPos.y);
            // strokes the current path with the styles we set earlier
            this.cx.stroke();
        }
    }
}
