import { Component, OnInit, OnChanges, ViewChild, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';
import { ExamItem } from '../../_models';
import { ExamItemService } from '../../_services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
    templateUrl: './examitemlist.component.html',
    selector: 'app-examitemlist',
    styleUrls: ['./examitemlist.component.css']
})
export class ExamItemListComponent implements OnInit, OnChanges {
    examItems: ExamItem[] = [];
    displayedColumns: string[] = ['select', 'id', 'score', 'criteriaName'];
    selection = new SelectionModel<ExamItem>(true, []);
    isLoadingResults = false;
    dataSource: MatTableDataSource<ExamItem>;

    @Input() initSelection: ExamItem[];
    @Output() selectionChanged = new EventEmitter<SelectionModel<ExamItem>>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private examItemService: ExamItemService) {

    }

    ngOnInit() {
        this.loadAllExamItems();
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
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        // suppose something changed with initSelection
        this.selection.clear();
        if (this.initSelection && this.examItems) {
            this.initSelection.forEach(selRow => {
                this.examItems.forEach(row => {
                    if (selRow.id === row.id) {
                        this.selection.select(row);
                    }
                });
            });
        }
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
        this.selectionChanged.emit(this.selection);
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.examItems.forEach(row => this.selection.select(row));
        this.selectionChanged.emit(this.selection);
    }
}
