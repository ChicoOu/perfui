import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { first } from 'rxjs/operators';
import { ExamItem, Exam, ExamResult } from '../../_models';
import { ExamItemService, AlertService, ExamService } from '../../_services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    templateUrl: './examlist.component.html',
    selector: 'app-examlist',
    styleUrls: ['./examlist.component.css']
})
export class ExamListComponent implements OnInit, OnChanges {
    @Input() examResult: ExamResult = null;
    displayedColumns: string[] = ['id', 'score', 'criteriaName', 'finalScore'];
    isLoadingResults = false;
    dataSource: MatTableDataSource<ExamItem>;
    @Output() scoreChanged = new EventEmitter<string>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor() {

    }

    ngOnInit() {
        this.refresh();
    }

    private refresh() {
        if (this.examResult) {
            this.isLoadingResults = false;
            if (this.examResult.scores) {
                let scores = String(this.examResult.scores);
                scores = scores.replace('[', '').replace(']', '');
                const items = scores.split(',');
                const examItemsSize = this.examResult.exam.examItems.length;
                for (let index = 0; index < items.length; index++) {
                    if (items[index]) {
                        this.examResult.exam.examItems[examItemsSize - items.length + index].finalScore = Number(items[index]);
                    } else {
                        this.examResult.exam.examItems[examItemsSize - items.length + index].finalScore = 0;
                    }
                }
            }
            this.dataSource = new MatTableDataSource(this.examResult.exam.examItems);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    private genScores(): string {
        let result = '[';
        this.examResult.finalScore = 0.0;
        this.examResult.exam.examItems.forEach(item => {
            result += item.finalScore + ',';
            if (item) {
                this.examResult.finalScore += Number(item);
            }
        });
        result = result.substr(0, result.length - 1);
        result += ']';

        return result;
    }

    onScoreChanged() {
        this.scoreChanged.emit(this.genScores());
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.refresh();
    }
}
