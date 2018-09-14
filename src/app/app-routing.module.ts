import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './_components/home';
import { ExamResultComponent } from './_components/examresult';
import { CriteriaComponent } from './_components/criteria';
import { LoginFormComponent } from './_components/login-form';
import { AuthGuard } from './_guards';

const appRoutes: Routes = [
    {
        path: '', component: HomeComponent, canActivate: [AuthGuard]
    },
    // { path: 'home', component: ExamResultComponent, outlet: 'homecontent' },
    // { path: 'criteria', component: CriteriaComponent, outlet: 'homecontent' },
    { path: 'login', component: LoginFormComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);

