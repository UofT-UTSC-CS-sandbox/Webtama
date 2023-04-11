import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
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
  // endpoint = "http://159.203.48.39:3000";
  endpoint = environment.apiEndpoint;
  socket: Socket;
  private headers: HttpHeaders;
  private accessToken: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    this.accessToken = "";
    this.socket = io(this.endpoint);
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.authService.getAccessTokenSilently().subscribe((accessToken) => {
          this.accessToken = accessToken;
          this.headers = new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // 'Cookie': document.cookie
          });
        });
      } else {
        this.headers = new HttpHeaders({
          "Content-Type": "application/json",
          // 'Cookie': document.cookie
        });
      }
    });
    console.log("headers: ", this.getAuthHeader());
  }

  private getAuthHeader() {
    return {
      headers: this.headers,
    };
  }

  setToken(token: string) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    console.log("headers: ", this.headers);
  }

  addRoom(name: string) {
    return this.http.post(
      this.endpoint + `/api/rooms`,
      { name },
      this.getAuthHeader()
    );
  }

  getRooms(): Observable<{ rooms: Room[] }> {
    return this.http.get<{ rooms: Room[] }>(
      this.endpoint + `/api/rooms`,
      this.getAuthHeader()
    );
  }

  matchmake() {
    return this.http.patch(this.endpoint + `/api/rooms/match`, {});
  }

  getRoom(id: number) {
    return this.http.get<{ room: Room }>(
      this.endpoint + `/api/rooms/${id}`,
      this.getAuthHeader()
    );
  }

  createBoard(id: number) {
    return this.http.post(
      this.endpoint + `/api/rooms/${id}/boards`,
      { id },
      this.getAuthHeader()
    );
  }

  getBoard(id: number): Observable<any> {
    return this.http.get<{ board: Board }>(
      this.endpoint + `/api/rooms/${id}/boards`,
      this.getAuthHeader()
    );
  }

  getPieces(id: number): Observable<{ pieces: Piece[] }> {
    return this.http.get<{ pieces: Piece[]; pieceCount: number }>(
      this.endpoint + `/api/rooms/${id}/boards/pieces`,
      this.getAuthHeader()
    );
  }

  checkTurn(roomId: number, userId: number) {
    return this.http.patch(
      this.endpoint + `/api/rooms/${roomId}/boards/turns`,
      { userId: userId },
      this.getAuthHeader()
    );
  }

  makeMove(id: number, x1: number, y1: number, x2: number, y2: number) {
    return this.http.patch(
      this.endpoint + `/api/rooms/${id}/boards`,
      {
        startx: x1,
        starty: y1,
        endx: x2,
        endy: y2,
      },
      this.getAuthHeader()
    );
  }

  draw(id: number) {
    return this.http.patch(
      this.endpoint + `/api/rooms/${id}/boards/draw`,
      {},
      this.getAuthHeader()
    );
  }

  playCard(roomId: number, card: number) {
    return this.http.patch(
      this.endpoint + `/api/rooms/${roomId}/boards/play`,
      { card },
      this.getAuthHeader()
    );
  }

  checkWin(roomId: number) {
    return this.http.get(
      this.endpoint + `/api/rooms/${roomId}/boards/wins`,
      this.getAuthHeader()
    );
  }

  joinRoom(roomId: number, userId: number) {
    console.log("joinging :" + roomId + " " + userId);
    return this.http.patch(this.endpoint + `/api/rooms/${roomId}/join`, {
      userId: userId,
    });
  }

  leaveRoom(roomId: number, userId: number) {
    return this.http.patch(
      this.endpoint + `/api/rooms/${roomId}/leave`,
      {
        userId: userId,
      },
      this.getAuthHeader()
    );
  }

  signIn() {
    return this.http
      .post<{ token: string }>(
        this.endpoint + `/users/signin`,
        this.getAuthHeader()
      )
      .subscribe({
        next: (data) => {
          console.log("data: ", data);
          this.setToken(data.token);
        },
        error: (error) => {
          console.error("There was an error!", error);
        },
      });
  }

  signUp() {
    return this.http
      .post<{ token: string }>(
        this.endpoint + `/users/signup`,
        this.getAuthHeader()
      )
      .subscribe({
        next: (data) => {
          console.log("data: ", data);
          this.setToken(data.token);
        },
        error: (error) => {
          console.error("There was an error!", error);
        },
      });
  }

  win(userId: number) {
    return this.http.patch(this.endpoint + `/${userId}/ratings`, {});
  }

  signOut() {
    return this.http
      .get(this.endpoint + `/users/signout`, this.getAuthHeader())
      .subscribe({
        next: (data) => {
          console.log("data: ", data);
          this.setToken("");
        },
        error: (error) => {
          console.error("There was an error!", error);
        },
      });
  }

  me(): Observable<any> {
    const requestOptions = {
      ...this.getAuthHeader(),
      withCredentials: true,
    };
    return this.http.get(this.endpoint + `/users/me`, requestOptions);
  }

  getActiveRoom(userId: number) {
    return this.http.get(
      this.endpoint + `/users/${userId}/rooms`,
      this.getAuthHeader()
    );
  }

  getUser(userId: number): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(
      this.endpoint + `/users/found/${userId}`,
      this.getAuthHeader()
    );
  }
  checkout(userId: number) {
    return this.http.post(
      this.endpoint + `/create-checkout-session`,
      { userId },
      this.getAuthHeader()
    );
  }

  roomDelete(roomId: number) {
    return this.http.delete(
      this.endpoint + `/api/rooms/${roomId}/delete`,
      this.getAuthHeader()
    );
  }
}
