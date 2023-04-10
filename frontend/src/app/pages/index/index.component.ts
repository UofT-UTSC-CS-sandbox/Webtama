import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../services/api.service";
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
})
export class IndexComponent implements OnInit {
  error: string = "";
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth() {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      if (isAuth) {
        console.log("authenticated");
        this.router.navigate(["/lobby"]);
      }
    });
  }
}
