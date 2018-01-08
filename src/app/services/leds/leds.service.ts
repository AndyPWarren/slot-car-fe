import { environment } from './../../../environments/environment';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

@Injectable()
export class LedsService {
    private url = `http://${environment.host}:${environment.port}/lanes`
    constructor(private http: Http) { }

    get(): Promise<string[]> {
        return this.http.get(this.url)
            .map((res) => res.json())
            .toPromise()
    }

}
