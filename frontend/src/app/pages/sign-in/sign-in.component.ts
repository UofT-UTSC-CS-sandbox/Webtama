import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  signIn() {
    const username = this.signInForm.value.username;
    const password = this.signInForm.value.password;
    this.api.signIn(username, password).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  signUp() {
    const username = this.signUpForm.value.username;
    const password = this.signUpForm.value.password;
    this.api.signUp(username, password).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }
}
