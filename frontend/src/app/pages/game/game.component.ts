import { Component, OnInit } from "@angular/core";
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
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {}

  async loadAudio() {
    const audioContext = new AudioContext();
    const audioSource = await fetch("moveSound.mp3");
    const audioBuffer = await audioContext.decodeAudioData(
      await audioSource.arrayBuffer()
    );

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }

  ngOnInit() {
    //If getRooms doeesnt return a room, create room with id 1
    this.apiService.getRooms().subscribe({
      next: (data) => {
        console.log(data);
        if (data.rooms.length === 0) {
          this.apiService.addRoom("Alpha Room").subscribe((data) => {});
          this.apiService.createBoard(1).subscribe(() => {});
          this.apiService.socket.emit("join room", {
            roomId: 1,
            playerName: "Kia",
          });
        } else {
          console.log("joinin room");
          this.apiService.socket.emit("join room", {
            roomId: 1,
            playerName: "Jason",
          });
        }

        //Get the board for room 1
        this.apiService.getBoard(1).subscribe({
          next: (data) => {},
          error: (err) => {
            console.log(err.status);
            if (err.status === 404) {
              this.apiService.createBoard(1).subscribe(() => {});
            }
          },
        });

        this.apiService.socket.emit("move", { roomId: 1 });
        this.apiService.socket.on("game state updated", (data) => {
          this.updateBoard();
        });
      },

      error: (err) => {
        console.log(err);
      },
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
    squares.forEach((square) => {
      const squareX = square.getAttribute("data-col");
      const squareY = square.getAttribute("data-row");
      if (squareX === null || squareY === null) {
        console.log("Square not found");
        return;
      }
      square.addEventListener("click", (e) => {
        this.makeMove(x, y, parseInt(squareX), parseInt(squareY));
      });
    });
  }

  makeMove(startx: number, starty: number, endx: number, endy: number) {
    let squares = document.querySelectorAll("td");
    squares.forEach((square) => {
      let new_square = square.cloneNode(true);
      if (square.parentNode !== null)
        square.parentNode.replaceChild(new_square, square);
    });

    this.apiService
      .makeMove(1, startx, starty, endx, endy)
      .subscribe((data) => {
        let piece = document.querySelector(
          `[data-x="${startx}"][data-y="${starty}"]`
        ) as HTMLElement;
        piece.classList.remove("selected");
        this.apiService.socket.emit("move", { roomId: 1 });
      });

    this.loadAudio();
  }

  updateBoard() {
    let pieces = document.querySelectorAll("p");
    pieces.forEach((piece) => {
      piece.remove();
    });
    this.apiService.getPieces(1).subscribe((data) => {
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
  }
}
