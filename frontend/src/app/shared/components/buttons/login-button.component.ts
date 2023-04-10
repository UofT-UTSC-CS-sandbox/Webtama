import { Component, OnInit } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-login-button",
  template: `
    <button class="button__login" (click)="handleLogin()">Log In</button>
  `,
})
export class LoginButtonComponent {
  constructor(private auth: AuthService, private apiService: ApiService) {}

  handleLogin(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: "/lobby",
      },
    });
    // .subscribe((data) => {
    //   this.apiService.signIn();
    // });
  }
}
