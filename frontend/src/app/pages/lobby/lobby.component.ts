import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../services/api.service";
import { AuthService } from "@auth0/auth0-angular";
import { ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-lobby",
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LobbyComponent implements OnInit {
  error: string = ""; // string representing the error message
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAuth();
    // this.apiService.signIn();
    // this.apiService.me().subscribe((data) => {
    //
    // });

    this.apiService.getRooms().subscribe({
      next: (data) => {
        if (data.rooms.length === 0) {
          let title = document.getElementById("lobbyInfo")!;
          title.innerHTML = "No rooms found";
        } else {
          for (let i = 0; i < data.rooms.length; i++) {
            this.showRoom(data.rooms[i].id);
          }
        }

        document.getElementById("roomCreate")!.addEventListener("click", () => {
          this.addRoom();
        });
        document.getElementById("matchmake")!.addEventListener("click", () => {
          this.match();
        });
      },
    });
  }

  checkAuth() {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      if (!isAuth) {
        console.log("not authenticated");
      }
    });
  }

  addRoom() {
    let roomId = -1;
    this.apiService.addRoom("Roomy ").subscribe((data) => {
      roomId = data as number;
      this.showRoom(roomId);
      let title = document.getElementById("lobbyInfo")!;
      title.innerHTML = "";
      return roomId;
    });
  }

  match() {
    let userId = -1;
    this.apiService.me().subscribe((userData) => {
      userId = userData as number;
      console.log("userId: ", userId);

      let foundRoom: number = -1;

      this.apiService.matchmake().subscribe((data) => {
        foundRoom = data as number;
        this.joinRoom(foundRoom, userId);
      });
    });
  }

  showRoom(roomId: number) {
    const display = document.createElement("div");
    display.className = "roomRow";
    display.innerHTML = "Room: " + roomId;
    const joinBtn = document.createElement("button");
    joinBtn.classList.add("kiaButton");
    joinBtn.classList.add("joinButton");
    joinBtn.setAttribute("roomId", roomId.toString());
    joinBtn.innerHTML = "Join";
    let userId = -1;
    this.apiService.me().subscribe((data) => {
      userId = data as number;
      joinBtn.addEventListener("click", () => {
        this.joinRoom(roomId, userId);
      });
      display.appendChild(joinBtn);
      const lobbyList = document.getElementById("lobbyList")!;
      lobbyList.appendChild(display);
    });
  }

  joinRoom(roomId: number, userId: number) {
    this.apiService.joinRoom(roomId, userId).subscribe((data) => {
      console.log(data);
      this.goToGame();
    });
  }

  goToGame() {
    if (this.isAuthenticated$) {
      this.router.navigate(["/game"]);
    } else {
      // handle not authenticated case, e.g. show a message or redirect to login page
      console.log("not authenticated");
    }
  }
}
