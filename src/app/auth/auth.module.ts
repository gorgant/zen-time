import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components//signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ResetPasswordDialogueComponent } from './components/reset-password-dialogue/reset-password-dialogue.component';
import { TermsAndConditionsDialogueComponent } from './components/terms-and-conditions-dialogue/terms-and-conditions-dialogue.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ResetPasswordDialogueComponent,
    TermsAndConditionsDialogueComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    AngularFireAuthModule
  ],
  entryComponents: [
    ResetPasswordDialogueComponent,
    TermsAndConditionsDialogueComponent
  ]
})
export class AuthModule { }
