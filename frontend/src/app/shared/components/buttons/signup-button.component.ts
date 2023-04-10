import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-signup-button",
  template: `
    <button class="button__sign-up" (click)="handleSignUp()">Sign Up</button>
  `,
})
export class SignupButtonComponent {
  constructor(private auth: AuthService, private apiService: ApiService) {}

  handleSignUp(): void {
    this.auth
      .loginWithRedirect({
        appState: {
          target: "/profile",
        },
        authorizationParams: {
          screen_hint: "signup",
        },
      })
      .subscribe((data) => {
        this.apiService.signUp();
      });
  }
}
