import { NgModule } from "@angular/core";
import { RouterModule, Routes, Router } from "@angular/router";
import { LobbyComponent } from "./pages/lobby/lobby.component";
import { IndexComponent } from "./pages/index/index.component";
import { GameComponent } from "./pages/game/game.component";

const routes: Routes = [
  {
    path: "lobby",
    component: LobbyComponent,
  },
  {
    path: "game",
    component: GameComponent,
  },
  {
    path: "",
    component: IndexComponent,
  },
  {
    path: "**",
    redirectTo: "/",
  },

  {
    path: "callback",
    loadChildren: () =>
      import("./features/callback/callback.module").then(
        (m) => m.CallbackModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(["/"]);
    };
  }
}
