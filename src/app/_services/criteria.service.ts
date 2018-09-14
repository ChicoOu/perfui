import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Criteria } from '../_models';

@Injectable()
export class CriteriaService {
    baseUrl = 'http://127.0.0.1:9191';

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Criteria[]>(this.baseUrl + `/criteria/`);
    }

    getById(id: number) {
        return this.http.get(this.baseUrl + `/criteria/` + id);
    }

    add(criteria: Criteria) {
        return this.http.post(this.baseUrl + `/criteria/`, criteria);
    }

    update(criteria: Criteria) {
        return this.http.put(this.baseUrl + `/criteria/` + criteria.id, criteria);
    }

    delete(id: number) {
        return this.http.delete(this.baseUrl + `/criteria/` + id);
    }
}
