import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // endpoint = 'http://localhost:3000';
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {}
  signIn(username: string, password: string) {
    return this.http.post<{ token: string }>(this.endpoint + `/users/signin`, {
      username,
      password,
    });
  }

  signUp(username: string, password: string) {
    return this.http.post<{ token: string }>(this.endpoint + `/users/signup`, {
      username,
      password,
    });
  }

  signOut() {
    return this.http.get(this.endpoint + `/users/signout`);
  }

  me() {
    return this.http.get(this.endpoint + `/users/me`);
  }
}
