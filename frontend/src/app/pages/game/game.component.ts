import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { io } from "socket.io-client";

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
          console.log("No rooms found");
          this.apiService.addRoom("Alpha Room").subscribe((data) => {
            console.log(data);
          });
          console.log("Preparing to create board");
          this.apiService.createBoard(1).subscribe(() => {
            console.log("Board created");
          });
          this.apiService.socket.emit("join", { roomId: 1, playerName: "Kia" });
        } else {
          console.log("Found room");
          this.apiService.socket.emit("join", {
            roomId: 1,
            playerName: "Jason",
          });
        }

        //Get the board for room 1
        this.apiService.getBoard(1).subscribe({
          next: (data) => {
            console.log(data);
          },
          error: (err) => {
            console.log("Board not found" + err);
            this.apiService.createBoard(1).subscribe(() => {
              console.log("Board created");
            });
          },
        });
        this.apiService.socket.emit("move", {roomId: 1});
        this.apiService.socket.on("game state updated", (data) => {
          this.updateBoard();
        });
      },

      error: (err) => {
        //Get the board for room 1
        this.apiService.getBoard(1).subscribe((data) => {
          console.log(data);
        });
        //this.updateBoard();
        this.apiService.socket.emit("move", { roomid: 1 });
        this.apiService.socket.on("game state updated", (data) => {
          this.updateBoard();
        });
      },
    });
  }

  pieceSelect(x: number, y: number) {
    //add the selected class to the piece
    let piece = document.querySelector(
      `[data-x="${x}"][data-y="${y}"]`
    ) as HTMLElement;
    piece.classList.add("selected");

    //remove all event listeners from <p> elements
    let pieces = document.querySelectorAll("p");
    pieces.forEach((piece) => {
      piece.removeEventListener("click", () => {
        this.pieceSelect(x, y);
      });
    });

    //add a event listener to all td elements
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

    //remove the selected class from the piece
    let piece = document.querySelector(
      `[data-x="${startx}"][data-y="${starty}"]`
    ) as HTMLElement;
    piece.classList.remove("selected");

    //remove all event listeners from <td> elements
    let squares = document.querySelectorAll("td");
    squares.forEach((square) => {
      square.removeEventListener("click", () => {
        this.makeMove(startx, starty, endx, endy);
      });
    });
    // Emit the move event to the server
    this.apiService.socket.emit("move", { roomid: 1 });
  }

  updateBoard() {
    this.apiService.getPieces(1).subscribe((data) => {
      for (let i = 0; i < data.pieces.length; i++) {
        const piece = data.pieces[i];
        //find the square with the same x and y
        let square = document.querySelector(
          `[data-row="${piece.xpos}"][data-col="${piece.ypos}"]`
        );
        if (square === null) {
          console.log("Square not found");
          return;
        }
        const display = document.createElement("p");
        //record the piece's x and y
        display.setAttribute("data-x", piece.xpos.toString());
        display.setAttribute("data-y", piece.ypos.toString());
        //add pieceSelect as event listener for clicking to the piece
        display.addEventListener("click", () => {
          this.pieceSelect(piece.xpos, piece.ypos);
        });
        //add the piece's type as a class for display
        display.classList.add(piece.type);
        //add the piece's side as a class for display
        if (piece.side == 0) {
          display.classList.add("aTeam");
        } else {
          display.classList.add("bTeam");
        }

        square.appendChild(display);
      }
      // update board for other player through api call
    });
  }
}
