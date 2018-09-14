import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Exam } from '../_models';

@Injectable()
export class ExamService {
    baseUrl = 'http://127.0.0.1:9191';

    curActiveExam: Exam = null;

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Exam[]>(this.baseUrl + `/exam/`);
    }

    getById(id: number) {
        return this.http.get(this.baseUrl + `/exam/` + id);
    }

    add(exam: Exam) {
        return this.http.post(this.baseUrl + `/exam/`, exam);
    }

    update(exam: Exam) {
        return this.http.put(this.baseUrl + `/exam/` + exam.id, exam);
    }

    delete(id: number) {
        return this.http.delete(this.baseUrl + `/exam/` + id);
    }

    setCurActiveExam(exam: Exam) {
        this.curActiveExam = exam;
        if (this.curActiveExam) {
            this.curActiveExam.examItems.forEach(item => {
                if (!item.finalScore) {
                    item.finalScore = 0;
                }

            });
        }
    }
}
