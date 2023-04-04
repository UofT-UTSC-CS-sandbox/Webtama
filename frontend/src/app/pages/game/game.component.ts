import { Component, OnInit, Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { io, Socket } from "socket.io-client";
import { ViewEncapsulation } from "@angular/core";
import { ApiService } from "../../services/api.service";

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

  async loadAudio() {
    const audioCtx = new AudioContext();
    let buffer: AudioBuffer;

    const audio = new Audio("http://localhost:4200/assets/audio/moveSound.mp3");

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(audioCtx.destination);
    audio.play();
  }

  async getRoomId() {
    let userId: number = 1;
    // this.apiService.me().subscribe((data) => {
    //   userId = data as number;
    // });
    let roomId: number = -1;
    this.apiService.getActiveRoom(userId).subscribe((data) => {
      roomId = data as number;
      return roomId;
    });

    return roomId;
  }

  ngOnInit() {
    this.cleanBoard();
    //dynamic
    let userId: number = 1;
    let roomId: number = -1;

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
          console.log(err.status);
          if (err.status === 404) {
            this.apiService.createBoard(roomId).subscribe();
            this.apiService.socket.emit("move", { roomId: roomId });
          }
        },
      });
    });

    this.apiService.socket.on("game state updated", (data) => {
      this.cleanBoard();
      console.log("game state updated");
      this.updateBoard();
    });
  }

  ngOnDestroy() {
    //dynamic
    let userId: number = 1;

    this.apiService.getActiveRoom(userId).subscribe((data) => {
      let roomId: number = data as number;

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

  pieceSelect(x: number, y: number) {
    let piece = document.querySelector(
      `[data-x="${x}"][data-y="${y}"]`
    ) as HTMLElement;
    piece.classList.add("selected");

    let pieces = document.querySelectorAll("p");
    pieces.forEach((piece) => {
      let new_piece = piece.cloneNode(true);
      if (piece.parentNode !== null)
        piece.parentNode.replaceChild(new_piece, piece);
    });

    let squares = document.querySelectorAll("td");
    let userId: number = 1;
    let roomId: number = -1;

    this.apiService.getActiveRoom(userId).subscribe((data) => {
      roomId = data as number;
    });
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

    this.loadAudio();
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
    if (kings.length === 1) {
      if (kings[0].classList.contains("aTeam")) {
        return 1;
      }
      return 2;
    }
    for (let i = 0; i < kings.length; i++) {
      if (
        kings[i].classList.contains("aTeam") &&
        kings[i].getAttribute("data-y") === "5"
      ) {
        return 1;
      } else if (
        kings[i].classList.contains("bTeam") &&
        kings[i].getAttribute("data-y") === "0"
      ) {
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
    //dynamic
    let userId: number = 1;
    let roomId: number = -1;

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
            this.pieceSelect(x, y);
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
    });
  }
}
