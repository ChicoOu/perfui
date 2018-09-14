import { ExamItem } from './examitem';

export class Exam {
    id: number;
    description: string;
    active: boolean;
    examItems: ExamItem[];
}

