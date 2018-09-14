import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    baseUrl = 'http://127.0.0.1:9191';

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(this.baseUrl + `/user/`);
    }

    getById(id: string) {
        return this.http.get(this.baseUrl + `/user/` + id);
    }

    register(user: User) {
        return this.http.post(this.baseUrl + `/user/`, user);
    }

    update(user: User) {
        return this.http.put(this.baseUrl + `/user/` + user.id, user);
    }

    delete(id: string) {
        return this.http.delete(this.baseUrl + `/user/` + id);
    }
}
