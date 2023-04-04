import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";
import { Piece } from "../classes/piece";
import { Room } from "../classes/room";
import { Board } from "../classes/board";
import { User } from "../classes/user";
import { io, Socket } from "socket.io-client";
import { AuthService } from "@auth0/auth0-angular";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  ///endpoint = "http://localhost:3000";
  endpoint = environment.apiEndpoint;
  socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io(this.endpoint);
  }
  addRoom(name: string) {
    return this.http.post(this.endpoint + `/api/rooms`, { name });
  }

  getRooms(): Observable<{ rooms: Room[] }> {
    return this.http.get<{ rooms: Room[] }>(this.endpoint + `/api/rooms`);
  }

  getRoom(id: number): Observable<{ room: Room }> {
    return this.http.get<{ room: Room }>(this.endpoint + `/api/rooms/${id}`);
  }

  createBoard(id: number) {
    return this.http.post(this.endpoint + `/api/rooms/${id}/boards`, { id });
  }

  getBoard(id: number): Observable<{ board: Board }> {
    return this.http.get<{ board: Board }>(
      this.endpoint + `/api/rooms/${id}/boards`
    );
  }

  getPieces(id: number): Observable<{ pieces: Piece[] }> {
    return this.http.get<{ pieces: Piece[]; pieceCount: number }>(
      this.endpoint + `/api/rooms/${id}/boards/pieces`
    );
  }

  makeMove(id: number, x1: number, y1: number, x2: number, y2: number) {
    return this.http.patch(this.endpoint + `/api/rooms/${id}/boards`, {
      startx: x1,
      starty: y1,
      endx: x2,
      endy: y2,
    });
  }

  joinRoom(roomId: number, userId: number) {
    console.log("joinging :" + roomId + " " + userId);
    return this.http.patch(this.endpoint + `/api/rooms/${roomId}/join`, {
      userId: userId,
    });
  }

  leaveRoom(roomId: number, userId: number) {
    return this.http.patch(this.endpoint + `/api/rooms/${roomId}/leave`, {
      userId: roomId,
    });
  }

  signIn(username: string, email: string) {
    return this.http.post<{ token: string }>(this.endpoint + `/users/signin`, {
      username,
      email,
    });
  }

  signUp(username: string, email: string) {
    return this.http.post<{ token: string }>(this.endpoint + `/users/signup`, {
      username,
      email,
    });
  }

  signOut() {
    return this.http.get(this.endpoint + `/users/signout`);
  }

  me() {
    return this.http.get(this.endpoint + `/users/me`);
  }

  getActiveRoom(userId: number) {
    return this.http.get(this.endpoint + `/users/${userId}/rooms`);
  }

  getUser(userId: number): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(this.endpoint + `/users/${userId}`);
  }
}
