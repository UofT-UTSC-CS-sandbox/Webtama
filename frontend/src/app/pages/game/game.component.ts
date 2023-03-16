import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { io, Socket } from "socket.io-client";

import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {}

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
          console.log("Game state updated");
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
      piece.removeEventListener("click", () => {
        this.pieceSelect(x, y);
      });
    });

    let squares = document.querySelectorAll("td");
    squares.forEach((square) => {
      const squareX = square.getAttribute("data-row");
      const squareY = square.getAttribute("data-col");
      if (squareX === null || squareY === null) {
        console.log("Square not found");
        return;
      }
      square.addEventListener("click", () => {
        this.makeMove(x, y, parseInt(squareX), parseInt(squareY));
      });
    });
  }

  makeMove(startx: number, starty: number, endx: number, endy: number) {
    //Can refactor this into a move event in the socket
    this.apiService
      .makeMove(1, startx, starty, endx, endy)
      .subscribe((data) => console.log(data));

    let piece = document.querySelector(
      `[data-x="${startx}"][data-y="${starty}"]`
    ) as HTMLElement;
    piece.classList.remove("selected");

    let squares = document.querySelectorAll("td");
    squares.forEach((square) => {
      square.removeEventListener("click", () => {
        this.makeMove(startx, starty, endx, endy);
      });
    });

    this.apiService.socket.emit("move", { roomid: 1 });
  }

  updateBoard() {
    this.apiService.getPieces(1).subscribe((data) => {
      console.log("update", data.pieces);
      console.log("update", data.pieces.length);
      for (let i = 0; i < data.pieces.length; i++) {
        const piece = data.pieces[i];
        let square = document.querySelector(
          `[data-row="${piece.xpos}"][data-col="${piece.ypos}"]`
        );
        if (square === null) {
          console.log("Square not found");
          return;
        }
        const display = document.createElement("p");
        display.setAttribute("data-x", piece.xpos.toString());
        display.setAttribute("data-y", piece.ypos.toString());
        display.addEventListener("click", () => {
          this.pieceSelect(piece.xpos, piece.ypos);
        });

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
