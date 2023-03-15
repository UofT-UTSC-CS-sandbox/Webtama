import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Piece } from "../classes/piece";
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  ///endpoint = "http://localhost:3000";
  endpoint = environment.apiEndpoint;
  socket: Socket;

  constructor(private http: HttpClient) {
    console.log(this.endpoint);
    this.socket = io(this.endpoint);
  }

  addRoom(name: string) {
    return this.http.post(this.endpoint + `/api/rooms`, { name });
  }

  getRooms() {
    return this.http.get(this.endpoint + `/api/rooms`);
  }

  getRoom(id: number) {
    return this.http.get(this.endpoint + `/api/rooms/${id}`);
  }

  createBoard(id: number) {
    return this.http.post(this.endpoint + `/boards`, { id });
  }

  getBoard(id: number) {
    return this.http.get(this.endpoint + `/boards/${id}`);
  }

  getPieces(id: number): Observable<{ pieces: Piece[] }> {
    return this.http.get<{ pieces: Piece[]; pieceCount: number }>(
      this.endpoint + `/boards/${id}/pieces`
    );
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

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
