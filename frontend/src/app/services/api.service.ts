import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  // endpoint = 'http://localhost:3000';
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  addRoom(name: string) {
    return this.http.post(this.endpoint + `/rooms`, { name });
  }

  getRooms() {
    return this.http.get(this.endpoint + `/rooms`);
  }

  getRoom(id: number) {
    return this.http.get(this.endpoint + `/rooms/${id}`);
  }

  createBoard(id: number) {
    return this.http.post(this.endpoint + `/boards`, { id });
  }

  getBoard(id: number) {
    return this.http.get(this.endpoint + `/boards/${id}`);
  }

  getPieces(id: number) {
    return this.http.get(this.endpoint + `/boards/${id}/pieces`);
  }

  makeMove(id: number, x1: number, y1: number, x2: number, y2: number) {
    return this.http.post(this.endpoint + `/boards/${id}`, {
      x1,
      y1,
      x2,
      y2,
    });
  }

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
