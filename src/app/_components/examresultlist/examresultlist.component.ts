import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChange, OnChanges } from '@angular/core';
import { first } from 'rxjs/operators';
import { ExamResult, INIT_EXAMRESULT } from '../../_models';
import { ExamService, AlertService } from '../../_services';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    templateUrl: './examresultlist.component.html',
    selector: 'app-examresultlist',
    styleUrls: ['./examresultlist.component.css']
})
export class ExamResultListComponent implements OnInit, OnChanges {
    @Input() examResults: ExamResult[] = [];
    @Output() examResultsChanged = new EventEmitter<ExamResult[]>();
    @Output() examSelected = new EventEmitter<ExamResult>();
    displayedColumns: string[] = ['id', 'studentId', 'examId', 'finalScore', 'scores', 'action'];
    isLoadingResults = false;
    dataSource: MatTableDataSource<ExamResult>;

    startStuId = '';
    endStuId = '';
    defaultScores = '[,]';
    genExamItemForm: FormGroup;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private examService: ExamService,
        private formBuilder: FormBuilder,
        private alertService: AlertService
    ) {

    }

    ngOnInit() {
        this.loadAllExamResults();
        this.genExamItemForm = this.formBuilder.group({
            startStuId: ['', Validators.required],
            endStuId: ['', Validators.required],
            defaultScores: [0, Validators.required]
        });
    }

    addRow() {
        const newRow = INIT_EXAMRESULT;
        this.examResults.push(newRow);
        this.examResultsChanged.emit(this.examResults);
    }

    onGenSubmit(): void {
        if (this.genExamItemForm.invalid) {
            return;
        }

        if (!this.examService.curActiveExam) {
            this.alertService.error('没有激活的考试项！');
            return;
        }

        let start = 0;
        let end = 0;
        let prefix = '';
        const postfix = 4;
        if (this.startStuId.length > postfix && this.endStuId.length > postfix) {
            prefix = this.startStuId.substr(0, this.startStuId.length - postfix);
            start = parseInt(this.startStuId.substr(this.startStuId.length - postfix, postfix), 10);
            end = parseInt(this.endStuId.substr(this.endStuId.length - postfix, postfix), 10);
        } else {
            start = parseInt(this.startStuId, 10);
            end = parseInt(this.endStuId, 10);
        }

        for (let index = start; index <= end; index++) {
            const newRow = new ExamResult();
            let zeropad = '';
            if (index < 10) {
                zeropad = '000';
            } else if (index < 100) {
                zeropad = '00';
            } else if (index < 1000) {
                zeropad = '0';
            }
            newRow.id = -1;
            newRow.studentId = prefix + zeropad + index.toString(10);
            newRow.scores = this.defaultScores;
            newRow.finalScore = 0;
            newRow.exam = this.examService.curActiveExam;
            this.examResults.push(newRow);
        }

        this.loadAllExamResults();
        this.examResultsChanged.emit(this.examResults);
    }

    deleteRow(row: ExamResult) {
        const index = this.examResults.indexOf(row);
        if (index < 0) {
            return;
        }

        this.examResults.splice(index, 1);
        this.loadAllExamResults();
        this.examResultsChanged.emit(this.examResults);
    }

    private loadAllExamResults() {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource(this.examResults);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        // suppose something changed with initSelection

        if (this.examResults) {
            this.loadAllExamResults();
        }
    }
}
