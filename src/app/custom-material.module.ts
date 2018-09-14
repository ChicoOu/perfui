import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    imports: [
        MatInputModule, BrowserAnimationsModule, MatCardModule, MatGridListModule,
        MatButtonModule, MatToolbarModule, MatTableModule, MatProgressSpinnerModule,
        MatPaginatorModule, MatCheckboxModule, MatTabsModule, MatDialogModule, MatSelectModule,
        MatChipsModule
    ],
    exports: [MatInputModule, MatCardModule, MatGridListModule, MatButtonModule,
        MatToolbarModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule,
        MatCheckboxModule, MatTabsModule, MatDialogModule, MatSelectModule, MatChipsModule]
})
export class CustomMaterialModule { }
