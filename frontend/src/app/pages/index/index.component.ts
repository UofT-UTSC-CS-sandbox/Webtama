import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../services/api.service";
import { AuthService } from "@auth0/auth0-angular";

/**
 * The index component is responsible for handling everything that a user can do in the home page.
 *
 * In this case, we are able to:
 * - create a new message
 * - upvote, downvote a message
 * - delete a message
 *
 * Note how this component makes all the API calls, but if you take a look at the .html.ts file, it does not
 * define at all how this page looks like. This is called a "smart component" in the "smart-dumb component" pattern.
 */
@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
})
export class IndexComponent implements OnInit {
  error: string = ""; // string representing the error message
  isAuthenticated$ = this.authService.isAuthenticated$;

  /**
   * Angular is famous for its dependency injection framework. If we want to use ApiService, we must declare it
   * in the constructor. This applies for all the non components you want to use in another component, and mostly,
   * it would be custom services you define.
   */
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
