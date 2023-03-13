import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../services/api.service";

let pieceX = -1;
let pieceY = -1;

@Component({
  selector: "app-game",
  templateUrl: "./game.html",
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
  }

  updateBoard() {
    this.apiService.getPieces(1).subscribe((data) => {
      for (let i = 0; i < data.length; i++) {}
    });
  }

  //   onSubmit() {
  //     this.apiService.createGame(this.gameForm.value).subscribe((data) => {
  //       this.router.navigate(["list-game"]);
  //     });
  //   }
}
