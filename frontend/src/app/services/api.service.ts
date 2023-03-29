import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Piece } from "../classes/piece";
import { Room } from "../classes/room";
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
  private headers: HttpHeaders;
  private accessToken: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    //console.log(this.endpoint);
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      // 'Cookie': document.cookie
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
    console.log("headers: ", this.headers);
  }

  private getAuthHeader() {
    return {
      headers: this.headers,
    };
  }

  setToken(token: string) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      'Authorization' : `Bearer ${token}`,
    });
    console.log("headers: ", this.headers);

  }

  addRoom(name: string) {
    return this.http.post(this.endpoint + `/api/rooms`, { name }, { headers: this.headers });
  }

  getRooms(): Observable<{ rooms: Room[] }> {
    return this.http.get<{ rooms: Room[] }>(this.endpoint + `/api/rooms`, { headers: this.headers });
  }

  getRoom(id: number) {
    return this.http.get(this.endpoint + `/api/rooms/${id}`, { headers: this.headers });
  }

  createBoard(id: number) {
    return this.http.post(this.endpoint + `/api/rooms/${id}/boards`, { id }, { headers: this.headers });
  }

  getBoard(id: number) {
    return this.http.get(this.endpoint + `/api/rooms/${id}/boards`, { headers: this.headers });
  }

  getPieces(id: number): Observable<{ pieces: Piece[] }> {
    return this.http.get<{ pieces: Piece[]; pieceCount: number }>(
      this.endpoint + `/api/rooms/${id}/boards/pieces`, { headers: this.headers }
    );
  }

  makeMove(id: number, x1: number, y1: number, x2: number, y2: number) {
    return this.http.patch(this.endpoint + `/api/rooms/${id}/boards`, {
      startx: x1,
      starty: y1,
      endx: x2,
      endy: y2,
    }, { headers: this.headers });
  }

  signIn(username: string, email: string) {
    return this.http.post<{ token: string }>(this.endpoint + `/users/signin`, {
      username,
      email,
    }).subscribe({
      next: (data) => {
        console.log("data: ", data);
        this.setToken(data.token);
      },
      error: (error) => {
        console.error("There was an error!", error);
      }
    });
  }

  signUp(username: string, email:string) {
    return this.http.post<{ token: string }>(this.endpoint + `/users/signup`, {
      username,
      email,
      headers: this.headers,
    }).subscribe({
      next: (data) => {
        console.log("data: ", data);
        this.setToken(data.token);
      },
      error: (error) => {
        console.error("There was an error!", error);
      }
    });
  }

  signOut() {
    return this.http.get(this.endpoint + `/users/signout`).subscribe({
      next: (data) => {
        console.log("data: ", data);
        this.setToken("");
      },
      error: (error) => {
        console.error("There was an error!", error);
      }
    });
    
  }

  me() {
    console.log("headers: ", this.headers)

    return this.http.get(this.endpoint + `/users/me`, this.getAuthHeader());

  }
}
