import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ExamResult, Statistic } from '../_models';

@Injectable()
export class ExamResultService {
    baseUrl = 'http://127.0.0.1:9191';

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<ExamResult[]>(this.baseUrl + `/examresult/`);
    }

    getById(id: number) {
        return this.http.get(this.baseUrl + `/examresult/` + id);
    }

    getStat(examId: number) {
        return this.http.get<Statistic>(this.baseUrl + `/examresult/stat/` + examId);
    }

    add(examresult: ExamResult) {
        return this.http.post(this.baseUrl + `/examresult/`, examresult);
    }

    addAll(examresults: ExamResult[]) {
        return this.http.post(this.baseUrl + `/examresult/batch`, examresults);
    }

    update(examresult: ExamResult) {
        return this.http.put(this.baseUrl + `/examresult/` + examresult.id, examresult);
    }

    delete(id: number) {
        return this.http.delete(this.baseUrl + `/examresult/` + id);
    }
}
