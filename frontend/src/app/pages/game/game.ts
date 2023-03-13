import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../services/api.service";

let pieceX = -1;
let pieceY = -1;

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
    this.apiService.getRooms().subscribe((data) => {
      if (!data) {
        this.apiService.addRoom("Alpha Room").subscribe(() => {});
        this.apiService.createBoard(1).subscribe(() => {});
      }
    });

    //Get the board for room 1
    this.apiService.getBoard(1).subscribe((data) => {
      console.log(data);
    });

    this.updateBoard();

    //Set the player names
  }

  pieceSelect(x: number, y: number) {
    pieceX = x;
    pieceY = y;
  }

  makeMove(x: number, y: number) {
    if (pieceX == -1 || pieceY == -1) {
      console.log("No piece selected");
      return;
    }
    this.apiService
      .makeMove(1, pieceX, pieceY, x, y)
      .subscribe((data) => console.log(data));

    pieceX = -1;
    pieceY = -1;

    this.updateBoard();
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
    });
  }
}
