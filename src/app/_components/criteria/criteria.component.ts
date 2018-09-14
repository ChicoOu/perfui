import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Criteria } from '../../_models';
import { CriteriaService, AlertService } from '../../_services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoDialogComponent } from '../infodlg';

const INIT_CRITERIA: Criteria = {
    id: -1,
    name: '',
    refValue: 0,
    minLowerDeviation: 0,
    maxLowerDeviation: 0,
    minUpperDeviation: 0,
    maxUpperDeviation: 0,
    examItemId: 0
};

@Component({
    templateUrl: './criteria.component.html',
    selector: 'app-criteria',
    styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit {
    criterials: Criteria[] = [];
    displayedColumns: string[] = ['select', 'id', 'name', 'refValue', 'minLowerDeviation',
        'maxLowerDeviation', 'minUpperDeviation', 'maxUpperDeviation'];
    selection = new SelectionModel<Criteria>(true, []);
    isLoadingResults = false;
    dataSource: MatTableDataSource<Criteria>;
    curCriteria: Criteria = INIT_CRITERIA;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    criteriaForm: FormGroup;

    constructor(private criteriaService: CriteriaService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private dialog: MatDialog) {

    }

    ngOnInit() {
        this.loadAllCriterials();
        this.criteriaForm = this.formBuilder.group({
            id: ['', Validators.nullValidator],
            name: ['', Validators.required],
            refValue: ['', Validators.required],
            minLowerDeviation: ['', Validators.required],
            maxLowerDeviation: ['', Validators.required],
            minUpperDeviation: ['', Validators.required],
            maxUpperDeviation: ['', Validators.required]
        });
    }

    deleteCriterial(id: number) {
        this.criteriaService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllCriterials();
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
                    this.deleteCriterial(row.id);
                });
                this.selection.clear();
            }
        });
    }

    private loadAllCriterials() {
        this.isLoadingResults = true;
        this.criteriaService.getAll().pipe(first()).subscribe(criterials => {
            if (!criterials) {
                this.criterials = [];
            } else {
                this.criterials = criterials;
            }
            this.isLoadingResults = false;
            this.dataSource = new MatTableDataSource(this.criterials);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    add() {
        this.selection.clear();
        this.curCriteria = INIT_CRITERIA;
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
        this.loadAllCriterials();
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
        const numRows = this.criterials.length;
        return numSelected === numRows;
    }

    singleToggle(row: Criteria) {
        this.selection.toggle(row);
        if (this.selection.hasValue()) {
            this.curCriteria = this.selection.selected[0];
        } else {
            this.curCriteria = INIT_CRITERIA;
        }
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.criterials.forEach(row => this.selection.select(row));
        if (this.selection.hasValue()) {
            this.curCriteria = this.selection.selected[0];
        } else {
            this.curCriteria = INIT_CRITERIA;
        }
    }

    onSubmit() {
        //this.submitted = true;

        // stop here if form is invalid
        if (this.criteriaForm.invalid) {
            return;
        }

        this.criteriaService.add(this.curCriteria)
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
