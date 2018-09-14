import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './_components/login-form';
import { CustomMaterialModule } from './custom-material.module';
import { routing } from './app-routing.module';
import { AlertComponent, EchartsDirective } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import {
    AlertService, AuthenticationService, UserService, CriteriaService,
    ExamItemService, ExamService, ExamResultService
} from './_services';
import {
    HomeComponent, CriteriaComponent, ExamResultComponent, ExamItemComponent,
    ExamComponent, InfoDialogComponent, ExamItemListComponent, ExamResultListComponent,
    ExamListComponent, StatisticComponent, UserComponent
} from './_components/';

@NgModule({
    declarations: [
        AppComponent,
        LoginFormComponent,
        AppComponent,
        AlertComponent,
        EchartsDirective,
        HomeComponent,
        CriteriaComponent,
        InfoDialogComponent,
        ExamResultComponent,
        ExamItemComponent,
        ExamComponent,
        ExamItemListComponent,
        ExamResultListComponent,
        ExamListComponent,
        StatisticComponent,
        UserComponent
    ],
    imports: [
        BrowserModule,
        CustomMaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing
    ],
    providers: [AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        CriteriaService,
        ExamItemService,
        ExamService,
        ExamResultService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
    entryComponents: [InfoDialogComponent, CriteriaComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
