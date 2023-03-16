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
  constructor(private api: ApiService, private router: Router, @Inject(DOCUMENT) public document: Document, public auth: AuthService) {}

  ngOnInit(): void {}

  signOut() {
    this.api.signOut().subscribe((response) => {
      this.auth.logout();
      this.router.navigate(['/sign-in']);
    });
  }
}
