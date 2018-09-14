import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { ExamItem, Criteria } from '../../_models';
import { ExamItemService, AlertService, CriteriaService } from '../../_services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoDialogComponent } from '../infodlg';

const INIT_EXAMITEM: ExamItem = {
    id: -1,
    score: 0,
    finalScore: 0,
    assCriteria: {
        id: -1,
        name: '',
        refValue: 0,
        minLowerDeviation: 0,
        maxLowerDeviation: 0,
        minUpperDeviation: 0,
        maxUpperDeviation: 0,
        examItemId: 0
    }
};

@Component({
    templateUrl: './examitem.component.html',
    selector: 'app-examitem',
    styleUrls: ['./examitem.component.css']
})
export class ExamItemComponent implements OnInit {
    examItems: ExamItem[] = [];
    displayedColumns: string[] = ['select', 'id', 'score', 'criteriaName'];
    selection = new SelectionModel<ExamItem>(true, []);
    isLoadingResults = false;
    dataSource: MatTableDataSource<ExamItem>;
    criterias: Criteria[] = [];
    curExamItem: ExamItem = INIT_EXAMITEM;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    examItemForm: FormGroup;

    constructor(private examItemService: ExamItemService,
        private criteriaService: CriteriaService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private dialog: MatDialog) {

    }

    ngOnInit() {
        this.loadAllExamItems();
        this.examItemForm = this.formBuilder.group({
            id: ['', Validators.nullValidator],
            score: ['', Validators.required],
            criteriaId: ['', Validators.required]
        });
    }

    deleteExamItem(id: number) {
        this.examItemService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllExamItems();
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
                    this.deleteExamItem(row.id);
                });
                this.selection.clear();
            }
        });
    }

    private loadAllExamItems() {
        this.isLoadingResults = true;
        this.examItemService.getAll().pipe(first()).subscribe(examItems => {
            if (!examItems) {
                this.examItems = [];
            } else {
                this.examItems = examItems;
            }
            this.isLoadingResults = false;
            this.dataSource = new MatTableDataSource(this.examItems);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });

        this.criteriaService.getAll().pipe(first()).subscribe(criterias => {
            if (!criterias) {
                this.criterias = [];
            } else {
                this.criterias = criterias;
            }
        });
    }

    add() {
        this.selection.clear();
        this.curExamItem = INIT_EXAMITEM;
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
        this.loadAllExamItems();
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

    singleToggle(row: ExamItem) {
        this.selection.toggle(row);
        if (this.selection.hasValue()) {
            this.curExamItem = this.selection.selected[0];
        } else {
            this.curExamItem = INIT_EXAMITEM;
        }
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.examItems.forEach(row => this.selection.select(row));
        if (this.selection.hasValue()) {
            this.curExamItem = this.selection.selected[0];
        } else {
            this.curExamItem = INIT_EXAMITEM;
        }
    }

    onSubmit() {
        //this.submitted = true;

        // stop here if form is invalid
        if (this.examItemForm.invalid) {
            return;
        }

        this.examItemService.add(this.curExamItem)
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
