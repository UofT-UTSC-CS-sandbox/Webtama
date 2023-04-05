import { Component, OnInit, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { io, Socket } from "socket.io-client";
import { ViewEncapsulation } from "@angular/core";
import { ApiService } from "../../services/api.service";

let GLOBALUSER: number = -1;

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class GameComponent implements OnInit {
  socket: Socket;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
    this.socket = io("http://localhost:3000");
  }

  async loadAudio(event: string) {
    const audioCtx = new AudioContext();
    let buffer: AudioBuffer;

    let audio = new Audio("http://localhost:4200/assets/audio/moveSound.mp3");
    if (event === "win") {
      audio = new Audio("http://localhost:4200/assets/audio/win.wav");
    } else if (event === "jeer") {
      audio = new Audio("http://localhost:4200/assets/audio/jeer.wav");
    }

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(audioCtx.destination);
    audio.play();
  }

  ngOnInit() {
    this.cleanBoard();
    //dynamic
    let userId: number = -1;
    let roomId: number = -1;

    this.apiService.me().subscribe((data) => {
      GLOBALUSER = data as number;
      userId = data as number;
      console.log("init user id: " + userId);

      this.apiService.getActiveRoom(userId).subscribe((data) => {
        roomId = data as number;
        this.apiService.socket.emit("join room", {
          roomId: roomId,
          playerName: "Beta",
        });
        this.updateName(roomId);
        this.apiService.getBoard(roomId).subscribe({
          next: (data) => {
            console.log("board found" + data + "roomId: " + roomId);
            this.apiService.socket.emit("move", { roomId: roomId });
          },
          error: (err) => {
            console.log(err);
            if (err.status === 404) {
              this.apiService.createBoard(roomId).subscribe();
              this.apiService.draw(roomId).subscribe();
              this.apiService.socket.emit("move", { roomId: roomId });
            }
          },
        });
      });
    });

    this.apiService.socket.on("game state updated", (data) => {
      this.cleanBoard();
      this.updateBoard();
    });

    this.apiService.socket.on("jeer", (data) => {
      document.getElementById("crowdJeer")!.innerHTML = data.message;
      this.loadAudio("jeer");
    });
    this.apiService.socket.on("player joined", (data) => {
      this.updateName(roomId);
    });
  }

  ngOnDestroy() {
    //dynamic
    let userId: number = -1;
    let roomId: number = -1;
    userId = GLOBALUSER;

    this.apiService.getActiveRoom(userId).subscribe((data) => {
      this.apiService.socket.emit("leave room", {
        roomId: roomId,
        playerName: "Beta",
      });
      this.apiService.getRoom(roomId).subscribe((roomData) => {
        if (roomData.room.Host === userId || roomData.room.Guest === userId) {
          this.apiService.leaveRoom(roomId, userId).subscribe();
        }
      });
    });
  }

  updateName(roomId: number) {
    console.log("updateName:");
    this.apiService.getRoom(roomId).subscribe((roomData) => {
      console.log(roomData);
      let player1 = document.getElementById("p1Title");
      let player2 = document.getElementById("p2Title");
      if (roomData.room.Host) {
        player1!.innerHTML = "User: " + roomData.room.Host.toString();
      }
      if (roomData.room.Guest) {
        player2!.innerHTML = "User: " + roomData.room.Guest.toString();
      }

      player1!.style.visibility = "visible";
      player2!.style.visibility = "visible";
    });
  }

  pieceSelect(x: number, y: number, roomId: number) {
    let piece = document.querySelector(
      `[data-x="${x}"][data-y="${y}"]`
    ) as HTMLElement;
    piece.classList.add("selected");

    let pieces = document.querySelectorAll("p");
    pieces.forEach((piece) => {
      let new_piece = piece.cloneNode(true);
      piece.parentNode!.replaceChild(new_piece, piece);
    });

    let squares = document.querySelectorAll("td");
    squares.forEach((square) => {
      const squareX = square.getAttribute("data-col");
      const squareY = square.getAttribute("data-row");
      if (squareX === null || squareY === null) {
        console.log("Square not found");
        return;
      }
      square.addEventListener("click", (e) => {
        this.makeMove(roomId, x, y, parseInt(squareX), parseInt(squareY));
      });
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

    let moveArray = JSON.parse(cardElement!.getAttribute("data-card")!);
    for (let i = 0; i < moveArray.length; i++) {
      const x = moveArray[i][0];
      const y = moveArray[i][1];
      if (startx + x > 5 || startx + x < 0 || starty + y > 5 || starty + y < 0)
        continue;
      let square = document.querySelector(
        `[data-row="${starty + y}"][data-col="${startx + x}"]`
      );
      let child = square!.firstElementChild;
      if (child !== null && child.classList.contains(team)) {
        continue;
      }
      square!.classList.add("selected");
      square!.addEventListener("click", (e) => {
        this.squareSelect;
      });
    }
  }

  squareSelect(
    roomId: number,
    startx: number,
    starty: number,
    x: number,
    y: number
  ) {
    let squares = document.querySelectorAll("td");
    squares.forEach((square) => {
      square.classList.remove("selected");
      let new_square = square.cloneNode(true);
      square.parentNode!.replaceChild(new_square, square);
    });
    this.makeMove(roomId, startx, starty, x, y);
  }

  makeMove(
    roomId: number,
    startx: number,
    starty: number,
    endx: number,
    endy: number
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
        this.apiService.socket.emit("move", {
          roomId: 1,
          startx,
          starty,
          endx,
          endy,
        });
      });

    this.loadAudio("move");
  }

  checkTurn(userId: number, roomId: number): boolean {
    this.apiService.getRoom(roomId).subscribe((roomData) => {
      this.apiService.getBoard(roomId).subscribe((boardData) => {
        if (roomData.room.Host === userId && boardData.board.turn % 2 === 0) {
          return true;
        }
        if (roomData.room.Guest === userId && boardData.board.turn % 2 !== 0) {
          return true;
        }
        return false;
      });
    });
    return false;
  }

  checkWin() {
    const kings = document.querySelectorAll(".king");
    let jeer = document.getElementById("crowdJeer")!;
    if (kings.length === 1) {
      if (kings[0].classList.contains("aTeam")) {
        jeer.innerHTML =
          document.getElementById("p1Title")!.innerHTML + " wins!";
        this.loadAudio("win");
        return 1;
      }
      jeer.innerHTML = document.getElementById("p2Title")!.innerHTML + " wins!";
      this.loadAudio("win");
      return 2;
    }
    for (let i = 0; i < kings.length; i++) {
      if (
        kings[i].classList.contains("aTeam") &&
        kings[i].getAttribute("data-y") === "5"
      ) {
        jeer.innerHTML =
          document.getElementById("p1Title")!.innerHTML + " wins!";
        this.loadAudio("win");
        return 1;
      } else if (
        kings[i].classList.contains("bTeam") &&
        kings[i].getAttribute("data-y") === "0"
      ) {
        jeer.innerHTML =
          document.getElementById("p2Title")!.innerHTML + " wins!";
        this.loadAudio("win");
        return 2;
      }
    }
    return 0;
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

    userId = GLOBALUSER;
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
            console.error("Square not found");
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
            this.pieceSelect(x, y, roomId);
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
      this.apiService.draw(roomId).subscribe();
      this.apiService.getBoard(roomId).subscribe((data) => {
        console.log("These are the cards");
        const card1 = JSON.parse(data.card1);
        const card2 = JSON.parse(data.card2);
        console.log(card1);
        console.log(card2);
        let card1Element = document.getElementById("card1")!;
        let card2Element = document.getElementById("card2")!;
        card1Element!.innerHTML = card1[0].toUpperCase();
        card1Element!.setAttribute("data-card", JSON.stringify(card1[1]));
        card2Element!.innerHTML = card2[0].toUpperCase();
        card2Element!.setAttribute("data-card", JSON.stringify(card2[1]));
        console.log("card elements");
        console.log(card1Element.getAttribute("data-card"));
        console.log(card1Element.getAttribute("data-card")!.length);
      });
    });
  }
}
