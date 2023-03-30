import { Component, OnInit, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated$
  constructor(private apiService: ApiService, private router: Router, @Inject(DOCUMENT) public document: Document, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.isAuthenticated$){
      this.authService.user$.subscribe(res => {
        if (res != null){
          this.apiService.signUp(JSON.stringify(res.nickname), JSON.stringify(res.email)).subscribe({
            next: (data) => {
            },
            error: (err) => {
              this.apiService.signIn(JSON.stringify(res.nickname), JSON.stringify(res.email)).subscribe({})}
          });
        }
      });
    }
  }
}
