import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "@auth0/auth0-angular";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated$;
  constructor(
    private apiService: ApiService,
    private router: Router,
    @Inject(DOCUMENT) public document: Document,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // if (this.isAuthenticated$){
    //   this.apiService.me().subscribe((data) => {
    //     console.log(data);
    //   });
    // }

    this.document.getElementById("signUp")?.addEventListener("click", () => {
      // this.apiService.signUp();
    });

    this.document.getElementById("signIn")?.addEventListener("click", () => {
      // this.apiService.signIn();
    });
  }
}
