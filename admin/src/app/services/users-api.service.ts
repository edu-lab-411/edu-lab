import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersApiService {
    private apiUrl = 'http://127.0.0.1:8000/api/dashboard';

    constructor(private http: HttpClient) {}

    getUsers(): Observable<any> {
        return this.http.get(`${this.apiUrl}/get_users`);
    }

    blockUser(userId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/block_user/${userId}`, {});
    }

    unblockUser(userId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/unblock_user/${userId}`, {});
    }
}
