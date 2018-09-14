import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models';
import { AuthenticationService } from '../../_services';

@Component({
    templateUrl: './home.component.html',
    selector: 'app-home',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    currentUser: User;
    curContent = 0;

    constructor(private authService: AuthenticationService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {

    }

    switchContent(index: number) {
        this.curContent = index;
    }

    logout() {
        this.authService.logout();
    }
}
