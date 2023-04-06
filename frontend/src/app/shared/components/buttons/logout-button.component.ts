import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { AuthService } from "@auth0/auth0-angular";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-logout-button",
  template: `
    <button class="button__logout" (click)="handleLogout()">Log Out</button>
  `,
})
export class LogoutButtonComponent {
  constructor(
    private auth: AuthService,
    private apiService: ApiService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  handleLogout(): void {
    this.apiService.signOut();
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
  }
}
