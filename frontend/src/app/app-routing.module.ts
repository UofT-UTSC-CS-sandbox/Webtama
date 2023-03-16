import { NgModule } from "@angular/core";
import { RouterModule, Routes, Router } from "@angular/router";
import { IndexComponent } from "./pages/index/index.component";
import { GameComponent } from "./pages/game/game.component";

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
  },
  {
    path: "game",
    component: GameComponent,
  },
  {
    path: "**",
    redirectTo: "/",
  },
  {
    path: "game",
    component: GameComponent,
  },
  {
    path: 'callback',
    loadChildren: () =>
      import('./features/callback/callback.module').then(
        (m) => m.CallbackModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(["/"]);
    };
  }
}
