import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components//signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ResetPasswordDialogueComponent } from './components/reset-password-dialogue/reset-password-dialogue.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ResetPasswordDialogueComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    AngularFireAuthModule
  ],
  entryComponents: [
    ResetPasswordDialogueComponent
  ]
})
export class AuthModule { }
