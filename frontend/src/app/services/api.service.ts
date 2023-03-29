import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Piece } from "../classes/piece";
import { Room } from "../classes/room";
import { io, Socket } from "socket.io-client";
import { AuthService } from "@auth0/auth0-angular";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  ///endpoint = "http://localhost:3000";
  endpoint = environment.apiEndpoint;
  socket: Socket;
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) {
    //console.log(this.endpoint);
    this.socket = io(this.endpoint);
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getAccessTokenSilently()}`
      // 'Cookie': document.cookie
    });
  }

  private getAuthHeader() {
    return {
      headers: this.headers
    };
  }

  addRoom(name: string) {
    return this.http.post(this.endpoint + `/api/rooms`, { name });
  }

  getRooms(): Observable<{ rooms: Room[] }> {
    return this.http.get<{ rooms: Room[] }>(this.endpoint + `/api/rooms`);
  }

  getRoom(id: number) {
    return this.http.get(this.endpoint + `/api/rooms/${id}`);
  }

  createBoard(id: number) {
    return this.http.post(this.endpoint + `/api/rooms/${id}/boards`, { id });
  }

  getBoard(id: number) {
    return this.http.get(this.endpoint + `/api/rooms/${id}/boards`);
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

  signIn(username: string, email: string) {
    return this.http.post<{ token: string }>(this.endpoint + `/users/signin`, {
      username,
      email,
      headers: this.headers,
    });
  }

  signUp(username: string, email:string) {
    return this.http.post<{ token: string }>(this.endpoint + `/users/signup`, {
      username,
      email,
      headers: this.headers,
    });
  }

  signOut() {
    return this.http.get(this.endpoint + `/users/signout`);
  }

  me() {
    return this.http.get(this.endpoint + `/users/me`);
  }
}
