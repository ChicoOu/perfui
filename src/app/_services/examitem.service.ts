import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ExamItem } from '../_models';

@Injectable()
export class ExamItemService {
    baseUrl = 'http://127.0.0.1:9191';

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<ExamItem[]>(this.baseUrl + `/examitem/`);
    }

    getById(id: number) {
        return this.http.get(this.baseUrl + `/examitem/` + id);
    }

    add(examitem: ExamItem) {
        return this.http.post(this.baseUrl + `/examitem/`, examitem);
    }

    update(examitem: ExamItem) {
        return this.http.put(this.baseUrl + `/examitem/` + examitem.id, examitem);
    }

    delete(id: number) {
        return this.http.delete(this.baseUrl + `/examitem/` + id);
    }
}
