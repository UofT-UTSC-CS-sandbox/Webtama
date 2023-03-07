import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {}

  signOut() {
    this.api.signOut().subscribe((response) => {
      this.router.navigate(['/sign-in']);
    });
  }
}
