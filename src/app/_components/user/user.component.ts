import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models';
import { UserService, AlertService } from '../../_services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoDialogComponent } from '../infodlg';
import { Md5 } from 'ts-md5';

@Component({
    templateUrl: 'user.component.html',
    selector: 'app-user',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    currentUser: User;
    currentEditUser = new User();
    users: User[] = [];

    displayedColumns: string[] = ['select', 'id', 'userName', 'dispName', 'role'];
    selection = new SelectionModel<User>(true, []);
    isLoadingResults = false;
    dataSource: MatTableDataSource<User>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    userForm: FormGroup;

    constructor(private userService: UserService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private dialog: MatDialog) {

    }

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadAllUsers();
        this.userForm = this.formBuilder.group({
            id: ['', Validators.nullValidator],
            userName: ['', Validators.required],
            dispName: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    deleteUser(id: string) {
        this.userService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllUsers();
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
                    if (row.admin) {
                        this.alertService.error('不能删除管理员！');
                        return;
                    }
                    this.deleteUser(row.id);
                });
                this.selection.clear();
            }
        });
    }

    private loadAllUsers() {
        this.isLoadingResults = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            if (!users) {
                this.users = [];
            } else {
                this.users = users;
            }
            this.isLoadingResults = false;
            this.dataSource = new MatTableDataSource(this.users);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
        this.currentEditUser.id = '-1';
    }

    add() {
        if (this.currentUser.admin) {
            this.selection.clear();
            this.users = [];
            this.tabGroup.selectedIndex = 1;
            this.alertService.success('');
        } else {
            this.alertService.error('无添加用户权限!');
        }

    }

    update() {
        this.alertService.success('');

        if (this.selection.hasValue()) {
            if (this.currentUser.admin ||
                this.currentEditUser.id === this.currentUser.id) {
                this.tabGroup.selectedIndex = 1;
            } else {
                this.alertService.error('无修改用户权限!');
            }

        } else {
            this.alertService.error('请选择记录！');
        }
    }

    delete() {
        this.alertService.success('');
        if (this.selection.hasValue()) {
            if (this.currentUser.admin) {
                this.openDialog('删除确认', '确定删除这些记录吗？');
            } else {
                this.alertService.error('无删除用户权限!');
            }
        } else {
            this.alertService.error('请选择记录！');
        }
    }

    refresh() {
        this.alertService.success('');
        this.selection.clear();
        this.loadAllUsers();
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
        const numRows = this.users.length;
        return numSelected === numRows;
    }

    singleToggle(row: User) {
        this.selection.toggle(row);
        if (this.selection.hasValue()) {
            this.currentEditUser = this.selection.selected[0];
        } else {
            this.currentEditUser = new User();
            this.currentEditUser.id = '-1';
        }
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.users.forEach(row => this.selection.select(row));
        if (this.selection.hasValue()) {
            this.currentEditUser = this.selection.selected[0];
        } else {
            this.currentEditUser = new User();
            this.currentEditUser.id = '-1';
        }
    }

    onSubmit() {
        //this.submitted = true;
        if (this.currentUser.role !== 1 &&
            this.currentEditUser.role !== this.currentUser.role) {
            this.alertService.error('无修改该用户权限！');
        }

        // stop here if form is invalid
        if (this.userForm.invalid) {
            return;
        }

        this.currentEditUser.newPassword = Md5.hashAsciiStr(this.currentEditUser.password, false).toString();
        if (this.currentEditUser.id !== '-1') {
            this.userService.update(this.currentEditUser)
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
        } else {
            this.userService.register(this.currentEditUser)
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
}
