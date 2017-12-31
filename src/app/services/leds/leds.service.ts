import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

@Injectable()
export class LedsService {
    private url = 'http://192.168.1.10:9090/leds'
    constructor(private http: Http) { }

    get(): Promise<string[]> {
        return this.http.get(this.url)
            .map((res) => res.json())
            .toPromise()
    }

}
