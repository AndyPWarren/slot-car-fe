import { Injectable } from "@angular/core";

@Injectable()
export class ColorConstants {
    public map: Map<string, string> = new Map([
        ['red', '#FF0000'],
        ['green', '#00FF00'],
        ['yellow', '#FFFF00']
    ]);
    constructor() {}
}
