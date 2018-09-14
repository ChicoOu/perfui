import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class AuthenticationService {
    private isLoggedIn = true;

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        this.isLoggedIn = false;
        const body = new HttpParams()
            .set('userName', username)
            .set('password', Md5.hashAsciiStr(password, false).toString());

        return this.http.post<any>(`http://127.0.0.1:9191/user/verify`, body.toString(), {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')
        })
            .pipe(map(resp => {
                // login successful if there's a jwt token in the response
                if (resp && resp.data) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(resp.data));
                    this.isLoggedIn = true;
                }

                return resp;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.isLoggedIn = false;
    }

    loggedIn(): boolean {
        return this.isLoggedIn;
    }
}
