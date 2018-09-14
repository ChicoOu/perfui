import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { ExamResult, Exam, INIT_EXAMRESULT } from '../../_models';
import { ExamResultService, AlertService, ExamService } from '../../_services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoDialogComponent } from '../infodlg';

@Component({
    templateUrl: './examresult.component.html',
    selector: 'app-examresult',
    styleUrls: ['./examresult.component.css']
})
export class ExamResultComponent implements OnInit {
    examResults: ExamResult[] = [];
    displayedColumns: string[] = ['select', 'id', 'studentId', 'examDescription', 'finalScore', 'scores'];
    selection = new SelectionModel<ExamResult>(true, []);
    isLoadingResults = false;
    dataSource: MatTableDataSource<ExamResult>;
    curExamResult: ExamResult = INIT_EXAMRESULT;
    curEditResult: ExamResult = null;
    editResults: ExamResult[] = null;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    examResultForm: FormGroup;

    constructor(private examResultService: ExamResultService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private dialog: MatDialog) {

    }

    ngOnInit() {
        this.loadAllExamResults();
        this.examResultForm = this.formBuilder.group({
        });
    }

    deleteExam(id: number) {
        this.examResultService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllExamResults();
        });
    }

    openDialog(title: string, message: string): void {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
            width: '250px',
            data: { title: title, message: message }
        });

        dialogRef.afterClosed().subscribe(result => {
            if ('OK' === result) {
                this.selection.selected.forEach(row => {
                    this.deleteExam(row.id);
                });
                this.selection.clear();
            }
        });
    }

    private loadAllExamResults() {
        this.isLoadingResults = true;

        this.examResultService.getAll().pipe(first()).subscribe(examResults => {
            if (!examResults) {
                this.examResults = [];
            } else {
                this.examResults = examResults;
            }
            this.isLoadingResults = false;
            this.dataSource = new MatTableDataSource(this.examResults);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    add() {
        this.selection.clear();
        this.curExamResult = INIT_EXAMRESULT;
        this.tabGroup.selectedIndex = 1;
        this.alertService.success('');
    }

    update() {
        this.alertService.success('');
        if (this.selection.hasValue()) {
            this.tabGroup.selectedIndex = 1;
        } else {
            this.alertService.error('请选择记录！');
        }
    }

    delete() {
        this.alertService.success('');
        if (this.selection.hasValue()) {
            this.openDialog('删除确认', '确定删除这些记录吗？');
        } else {
            this.alertService.error('请选择记录！');
        }
    }

    refresh() {
        this.alertService.success('');
        this.selection.clear();
        this.loadAllExamResults();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.examResults.length;
        return numSelected === numRows;
    }

    singleToggle(row: ExamResult) {
        this.selection.toggle(row);
        if (this.selection.hasValue()) {
            this.curExamResult = this.selection.selected[0];
        } else {
            this.curExamResult = INIT_EXAMRESULT;
        }
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.examResults.forEach(row => this.selection.select(row));
        if (this.selection.hasValue()) {
            this.curExamResult = this.selection.selected[0];
        } else {
            this.curExamResult = INIT_EXAMRESULT;
        }
    }

    onSubmit() {
        // stop here if form is invalid

        if (this.editResults) {
            this.examResultService.addAll(this.editResults)
                .pipe(first())
                .subscribe(
                    data => {
                        console.log(data);
                        this.alertService.success('');
                        this.tabGroup.selectedIndex = 0;
                        this.refresh();
                    },
                    error => {
                        this.alertService.error(error);
                    });
        }

    }

    onExamResultsChanged(results: ExamResult[]): void {
        this.editResults = results;
    }

    onExamSelected(result: ExamResult): void {
        this.curEditResult = result;
    }

    onScoreChanged(scores: string): void {
        this.curEditResult.scores = scores;
        this.calcFinalScore();
    }

    calcFinalScore(): void {
        if (this.curEditResult.scores) {
            let scores = this.curEditResult.scores;
            scores = scores.replace('[', '').replace(']', '');
            const items = scores.split(',');
            this.curEditResult.finalScore = 0.0;
            items.forEach(item => {
                if (item) {
                    this.curEditResult.finalScore += Number(item);
                }
            });
        }
    }
}
