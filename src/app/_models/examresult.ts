import { Exam } from './exam';

export class ExamResult {
    id: number;
    studentId: string;
    finalScore: number;
    scores: string;
    exam: Exam;
}

export const INIT_EXAMRESULT: ExamResult = {
    id: -1,
    studentId: '',
    finalScore: 0,
    scores: '',
    exam: null
};
