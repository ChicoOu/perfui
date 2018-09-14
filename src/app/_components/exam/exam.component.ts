import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { ExamItem, Exam } from '../../_models';
import { ExamItemService, AlertService, ExamService } from '../../_services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoDialogComponent } from '../infodlg';

const INIT_EXAM: Exam = {
    id: -1,
    description: '',
    active: true,
    examItems: []
};

@Component({
    templateUrl: './exam.component.html',
    selector: 'app-exam',
    styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
    exams: Exam[] = [];
    displayedColumns: string[] = ['select', 'id', 'description', 'active', 'examItems'];
    selection = new SelectionModel<Exam>(true, []);
    isLoadingResults = false;
    dataSource: MatTableDataSource<Exam>;
    examItems: ExamItem[] = [];
    curExam: Exam = INIT_EXAM;
    examActive = '1';
    examItemsStr = '';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    examForm: FormGroup;

    constructor(private examItemService: ExamItemService,
        private examService: ExamService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private dialog: MatDialog) {

    }

    ngOnInit() {
        this.loadAllExams();
        this.examForm = this.formBuilder.group({
            id: ['', Validators.nullValidator],
            description: ['', Validators.required],
            active: [false, Validators.required],
            examItems: ['', Validators.required]
        });
    }

    deleteExam(id: number) {
        this.examService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllExams();
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

    private loadAllExams() {
        this.isLoadingResults = true;
        this.examItemService.getAll().pipe(first()).subscribe(examItems => {
            if (!examItems) {
                this.examItems = [];
            } else {
                this.examItems = examItems;
            }
        });

        this.examService.getAll().pipe(first()).subscribe(exams => {
            if (!exams) {
                this.exams = [];
            } else {
                this.exams = exams;
            }

            this.exams.forEach(exam => {
                if (exam.active) {
                    this.examService.setCurActiveExam(exam);
                }
            });

            this.isLoadingResults = false;
            this.dataSource = new MatTableDataSource(this.exams);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    add() {
        this.selection.clear();
        this.curExam = INIT_EXAM;
        this.examActive = this.curExam.active ? '0' : '1';
        this.tabGroup.selectedIndex = 1;
        this.alertService.success('');
    }

    update() {
        this.alertService.success('');
        if (this.selection.hasValue()) {
            this.tabGroup.selectedIndex = 1;
            this.examItems2Str();
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
        this.loadAllExams();
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
        const numRows = this.examItems.length;
        return numSelected === numRows;
    }

    singleToggle(row: Exam) {
        this.selection.toggle(row);
        if (this.selection.hasValue()) {
            this.curExam = this.selection.selected[0];
        } else {
            this.curExam = INIT_EXAM;
            this.examItems2Str();
        }

        this.examActive = this.curExam.active ? '0' : '1';
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.exams.forEach(row => this.selection.select(row));
        if (this.selection.hasValue()) {
            this.curExam = this.selection.selected[0];
        } else {
            this.curExam = INIT_EXAM;
            this.examItems2Str();
        }

        this.examActive = this.curExam.active ? '0' : '1';
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.examForm.invalid) {
            return;
        }

        this.curExam.active = this.examActive === '0';
        this.examService.add(this.curExam)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data);
                    this.alertService.success('');
                    this.tabGroup.selectedIndex = 0;
                    this.curExam = INIT_EXAM;
                    this.refresh();
                },
                error => {
                    this.alertService.error(error);
                });
    }

    examItems2Str() {
        this.examItemsStr = '';
        if (this.curExam && this.curExam.examItems) {
            this.curExam.examItems.forEach(item => {
                this.examItemsStr += item.id + ',';
            });
        }

        if (this.examItemsStr.length > 0) {
            this.examItemsStr = this.examItemsStr.substr(0, this.examItemsStr.length - 1);
        }
    }

    onExamItemChanged(examItemSelection: SelectionModel<ExamItem>) {
        this.curExam.examItems = examItemSelection.selected;
        this.examItems2Str();
    }
}
