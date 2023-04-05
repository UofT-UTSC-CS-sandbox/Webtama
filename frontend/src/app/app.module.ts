import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LobbyComponent } from "./pages/lobby/lobby.component";
import { HeaderComponent } from "./components/header/header.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ApiInterceptor } from "./api.interceptor";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GameComponent } from "./pages/game/game.component";
import { AuthModule, AuthHttpInterceptor } from "@auth0/auth0-angular";
import { SharedModule } from "./shared/shared.module";
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [AppComponent, HeaderComponent, GameComponent, LobbyComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxStripeModule.forRoot('pk_test_51MtDc1HEHppe6KHvYIobWDiOgg8FG4hsFz6U4aFd3jFjuNfDQw9Amuxu8QGhpuy8SxBdYcMRdPqmIZ4pYBuj1xuY00JQfJ46rw'),
    BrowserModule,
    SharedModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: "dev-0rubju8i61qqpmgv.us.auth0.com",
      clientId: "dibFRURk5XSOdzcA66JIBCs4n38zwein",
      authorizationParams: {
        redirect_uri: "http://localhost:4200/callback",
        audience: "https://dev-0rubju8i61qqpmgv.us.auth0.com/api/v2/",
        scope: "read:current_user update:current_user_metadata"
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: Window,
      useValue: window,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
