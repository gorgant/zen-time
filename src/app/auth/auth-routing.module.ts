import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { LoginGuard } from './route-guards/login.guard';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [LoginGuard]
   },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
