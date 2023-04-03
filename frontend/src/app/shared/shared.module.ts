import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedRoutingModule } from "./shared-routing.module";
import { LoginButtonComponent } from "./components/buttons/login-button.component";
import { SignupButtonComponent } from "./components/buttons/signup-button.component";
import { LogoutButtonComponent } from "./components/buttons/logout-button.component";

@NgModule({
  declarations: [
    LoginButtonComponent,
    SignupButtonComponent,
    LogoutButtonComponent,
  ],
  imports: [CommonModule, SharedRoutingModule],
  exports: [LoginButtonComponent, SignupButtonComponent, LogoutButtonComponent],
})
export class SharedModule {}
