import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { GameComponent } from './pages/game/game.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
  {
    path: 'game',
    component: GameComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(['/']);
    };
  }
}
