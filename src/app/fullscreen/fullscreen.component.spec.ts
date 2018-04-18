import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenComponent } from './fullscreen.component';
import fscreen from 'fscreen';
import { By } from '@angular/platform-browser';

describe('FullscreenComponent', () => {
    let component: FullscreenComponent;
    let fixture: ComponentFixture<FullscreenComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FullscreenComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FullscreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('full screen mode not engaged', () => {
        it('should enter full screen mode when button is clicked', () => {
            const spy = spyOn(fscreen, 'requestFullscreen');
            fixture.debugElement.query(By.css('#fullscreen'))
            .nativeElement.click();
            expect(spy).toHaveBeenCalledWith(document.documentElement);
        });
        it('should set the button text to be enter', () => {
            const btn = fixture.debugElement.query(By.css('#fullscreen')).nativeElement;
            expect(btn.textContent).toMatch('Enter');
        });
    });

});

