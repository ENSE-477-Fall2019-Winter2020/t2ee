import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/models/user';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    httpOptions = {
        headers: new HttpHeaders({
            "Access-Control-Allow-Origin": "*"
        })
      };

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        let hashedPassword = Md5.hashStr(password);
        let httpHeaders = new HttpHeaders;
        httpHeaders = httpHeaders.append("Authorization", "Basic " + btoa(username+":"+hashedPassword));
        httpHeaders = httpHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        return this.http.post<any>("/api/user/login", "", {headers : httpHeaders})
        .pipe(
            map(user => {
            // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
            user.authdata = window.btoa(username + ':' + hashedPassword);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    signup(username: string, password: string, email: string){
        let hashedPassword = Md5.hashStr(password);
        return this.http.post<any>("/api/user/create", {
            "username": username,
            "email": email,
            "password": hashedPassword
        })
        .pipe(
            map(user => {
            // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
            user.authdata = window.btoa(username + ':' + hashedPassword);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
