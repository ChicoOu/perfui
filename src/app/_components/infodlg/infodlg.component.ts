import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
    message: string;
    title: string;
}

@Component({
    selector: 'app-infodlg',
    templateUrl: './infodlg.component.html',
})
export class InfoDialogComponent {
    action = 'OK';

    constructor(
        public dialogRef: MatDialogRef<InfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
        this.action = 'Cancel';
    }
}
