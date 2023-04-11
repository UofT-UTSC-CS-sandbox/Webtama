import { Component, OnInit, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { io, Socket } from "socket.io-client";
import { ViewEncapsulation } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { ViewChildren, QueryList, ElementRef } from "@angular/core";
import { environment } from "../../../environments/environment.prod";
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class GameComponent implements OnInit {
  socket: Socket;
  @ViewChildren(".king") kingElements!: QueryList<ElementRef>;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
    this.socket = io(environment.apiEndpoint);
  }

  async loadAudio(event: string) {
    const audioCtx = new AudioContext();
    let buffer: AudioBuffer;

    let audio = new Audio("https://webtama.works/assets/audio/moveSound.mp3");
    if (event === "win") {
      audio = new Audio("https://webtama.works/assets/audio/win.wav");
    } else if (event === "jeer") {
      audio = new Audio("https://webtama.works/assets/audio/jeer.wav");
    }

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(audioCtx.destination);
    audio.play();
  }

  ngOnInit() {
    this.cleanBoard();
    let userId: number = -1;
    let roomId: number = -1;

    this.apiService.me().subscribe((data) => {
      userId = data as number;

      this.apiService.getActiveRoom(userId).subscribe((data) => {
        roomId = data as number;
        this.apiService.socket.emit("join room", {
          roomId: roomId,
          playerName: userId,
        });
        this.updateName(roomId);
        this.apiService.getBoard(roomId).subscribe({
          next: (data) => {
            this.apiService.socket.emit("move", { roomId: roomId });
          },
          error: (err) => {
            console.log(err);
            if (err.status === 404) {
              this.apiService.createBoard(roomId).subscribe(() => {
                this.apiService.draw(roomId).subscribe(() => {
                  this.apiService.socket.emit("move", { roomId: roomId });
                });
              });
            }
          },
        });
      });
    });

    this.apiService.socket.on("game state updated", (data) => {
      console.log("game state updated");
      this.cleanBoard();
      this.updateBoard();
      this.checkWin();
    });

    this.apiService.socket.on("jeer", (data) => {
      document.getElementById("crowdJeer")!.innerHTML = data.message;
      document.getElementById("crowdJeer")!.style.visibility = "visible";
      this.loadAudio("jeer");
      setTimeout(() => {
        document.getElementById("crowdJeer")!.style.visibility = "hidden";
      }, 2000);
    });
    this.apiService.socket.on("player joined", (data) => {
      this.updateName(roomId);
    });

    this.apiService.socket.on("player left", (data) => {
      this.updateName(roomId);
    });
  }

  ngOnDestroy() {
    let userId: number = -1;
    let roomId: number = -1;
    this.apiService.me().subscribe((data) => {
      userId = data as number;
      this.apiService.getActiveRoom(userId).subscribe((data) => {
        roomId = data as number;
        this.apiService.socket.emit("leave room", {
          roomId: roomId,
          playerName: userId,
        });
        this.apiService.getRoom(roomId).subscribe((roomData) => {
          let host = roomData.room.Host as number;
          let guest = roomData.room.Guest as number;
          if (host == userId || guest == userId) {
            console.log(this.apiService.leaveRoom(roomId, userId).subscribe());
          }
        });
      });
    });
  }

  updateName(roomId: number) {
    this.apiService.getRoom(roomId).subscribe((roomData) => {
      let player1 = document.getElementById("p1Title");
      let player2 = document.getElementById("p2Title");
      if (roomData.room.Host) {
        player1!.innerHTML = "User: " + roomData.room.Host.toString();
      } else if (!roomData.room.Host) {
        player1!.innerHTML = "Empty";
      }
      if (roomData.room.Guest) {
        player2!.innerHTML = "User: " + roomData.room.Guest.toString();
      } else if (!roomData.room.Guest) {
        player2!.innerHTML = "Empty";
      }

      player1!.style.visibility = "visible";
      player2!.style.visibility = "visible";
    });
  }

  pieceSelect(x: number, y: number, roomId: number, userId: number) {
    this.apiService.checkTurn(roomId, userId).subscribe((data) => {
      if (data === "false") {
        console.log("not your turn " + userId);
        return;
      } else {
        let piece = document.querySelector(
          `[data-x="${x}"][data-y="${y}"]`
        ) as HTMLElement;
        piece.classList.add("selected");

        let pieces = document.querySelectorAll("p");
        pieces.forEach((piece) => {
          let new_piece = piece.cloneNode(true);
          piece.parentNode!.replaceChild(new_piece, piece);
        });

        let card1 = document.getElementById("card1");
        let card2 = document.getElementById("card2");
        card1!.addEventListener("click", (e) => {
          this.cardSelect(roomId, 1, x, y, data as string);
        });
        card2!.addEventListener("click", (e) => {
          this.cardSelect(roomId, 2, x, y, data as string);
        });
      }
    });
  }

  cardSelect(
    roomId: number,
    card: number,
    startx: number,
    starty: number,
    team: string
  ) {
    let cardElement;
    if (card === 1) {
      cardElement = document.getElementById("card1");
    } else {
      cardElement = document.getElementById("card2");
    }

    this.removeSquareListeners();

    let moveArray = JSON.parse(cardElement!.getAttribute("data-card")!);
    for (let i = 0; i < moveArray.length; i++) {
      const x = moveArray[i][0];
      const y = moveArray[i][1];
      if (
        startx + x > 5 ||
        startx + x < 1 ||
        starty + y > 5 ||
        starty + y < 1
      ) {
        continue;
      } else {
        let square = document.querySelector(
          `[data-row="${starty + y}"][data-col="${startx + x}"]`
        );
        square!.classList.add("selected");
        square!.addEventListener("click", (e) => {
          this.squareSelect(
            roomId,
            startx,
            starty,
            startx + x,
            starty + y,
            card
          );
        });
      }
    }
  }

  removeSquareListeners() {
    let squares = document.querySelectorAll("td");
    squares.forEach((square) => {
      square.classList.remove("selected");
      let new_square = square.cloneNode(true);
      square.parentNode!.replaceChild(new_square, square);
    });
  }

  squareSelect(
    roomId: number,
    startx: number,
    starty: number,
    x: number,
    y: number,
    card: number
  ) {
    this.removeSquareListeners();
    this.makeMove(roomId, startx, starty, x, y, card);
  }

  makeMove(
    roomId: number,
    startx: number,
    starty: number,
    endx: number,
    endy: number,
    card: number
  ) {
    let squares = document.querySelectorAll("td");
    squares.forEach((square) => {
      let new_square = square.cloneNode(true);
      if (square.parentNode !== null)
        square.parentNode.replaceChild(new_square, square);
    });

    this.apiService
      .makeMove(roomId, startx, starty, endx, endy)
      .subscribe((data) => {
        let piece = document.querySelector(
          `[data-x="${startx}"][data-y="${starty}"]`
        ) as HTMLElement;
        piece.classList.remove("selected");
        this.apiService.playCard(roomId, card).subscribe((data) => {
          this.apiService.draw(roomId).subscribe((newBoard) => {
            this.apiService.socket.emit("move", {
              roomId: roomId,
              startx,
              starty,
              endx,
              endy,
            });
          });
        });
      });

    let cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      let new_card = card.cloneNode(true);
      card.parentNode!.replaceChild(new_card, card);
    });

    this.loadAudio("move");
  }

  checkWin() {
    let userId: number = 0;
    this.apiService.me().subscribe((data) => {
      userId = data as number;
      this.apiService.getActiveRoom(userId).subscribe((activeRoom) => {
        this.apiService.checkWin(activeRoom as number).subscribe((data) => {
          if (data == -1) {
            return;
          } else {
            this.doWin(data as number, userId);
          }
        });
      });
    });
  }

  doWin(winner: number, userId: number) {
    let jeer = document.getElementById("crowdJeer")!;
    jeer.style.visibility = "visible";
    this.apiService.getActiveRoom(userId).subscribe((data) => {
      this.apiService.getRoom(data as number).subscribe((roomData) => {
        if (winner === 1) {
          jeer.innerHTML =
            document.getElementById("p1Title")!.innerHTML + " wins!";
          this.apiService.win(roomData.room.Host as number);
        }
        if (winner === 2) {
          jeer.innerHTML =
            document.getElementById("p2Title")!.innerHTML + " wins!";
          this.apiService.win(roomData.room.Guest as number);
        }
        this.loadAudio("win");

        setTimeout(() => {
          this.apiService.getActiveRoom(userId).subscribe((data) => {
            this.apiService.roomDelete(data as number).subscribe((data) => {
              this.router.navigate(["/lobby"]);
            });
          });
        }, 5000);
      });
    });
  }

  cleanBoard() {
    let pieces = document.querySelectorAll("p");
    pieces.forEach((piece) => {
      piece.remove();
    });
  }

  updateBoard() {
    let userId: number = -1;
    let roomId: number = -1;

    this.apiService.me().subscribe((data) => {
      userId = data as number;
      this.apiService.getActiveRoom(userId).subscribe((data) => {
        roomId = data as number;
        this.apiService.getPieces(roomId).subscribe((data) => {
          this.cleanBoard();
          for (let i = 0; i < data.pieces.length; i++) {
            const piece = data.pieces[i];
            let square = document.querySelector(
              `[data-row="${piece.ypos}"][data-col="${piece.xpos}"]`
            );
            if (square === null) {
              return;
            }
            const display = document.createElement("p");
            display.setAttribute("data-x", piece.xpos.toString());
            display.setAttribute("data-y", piece.ypos.toString());

            let pieceEvent = (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              const x = piece.xpos;
              const y = piece.ypos;
              this.pieceSelect(x, y, roomId, userId);
            };

            display.addEventListener("click", pieceEvent);

            display.classList.add(piece.type);
            if (piece.side == 0) {
              display.classList.add("aTeam");
            } else {
              display.classList.add("bTeam");
            }
            square.appendChild(display);
          }
        });

        this.apiService.getBoard(roomId).subscribe((data) => {
          const card1 = JSON.parse(data.card1);
          const card2 = JSON.parse(data.card2);
          let card1Element = document.getElementById("card1")!;
          let card2Element = document.getElementById("card2")!;
          card1Element!.innerHTML = card1[0].toUpperCase();
          card1Element!.setAttribute("data-card", JSON.stringify(card1[1]));
          card2Element!.innerHTML = card2[0].toUpperCase();
          card2Element!.setAttribute("data-card", JSON.stringify(card2[1]));
        });
      });
    });
  }
}
