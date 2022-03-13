import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { Login1Component } from './login1/login1.component';
import { RegisterComponent } from './register/register.component';
import { Register1Component } from './register1/register1.component';
import { RecoverpwdComponent } from './recoverpwd/recoverpwd.component';
import { Recoverpwd1Component } from './recoverpwd1/recoverpwd1.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { ConfirmmailComponent } from './confirmmail/confirmmail.component';
import { EmailverificationComponent } from './emailverification/emailverification.component';
import { SteptwoverificationComponent } from './steptwoverification/steptwoverification.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  // {
  //   path: 'login1',
  //   component: Login1Component,
  // },
  {
    path: 'register',
    component: RegisterComponent,
  },
  // {
  //   path: 'register1',
  //   component: Register1Component,
  // },
  {
    path: 'recoverpwd',
    component: RecoverpwdComponent,
  },
  // {
  //   path: 'recoverpwd1',
  //   component: Recoverpwd1Component,
  // },
  {
    path: 'lockscreen',
    component: LockscreenComponent,
  },
  {
    path: 'confirm-mail',
    component: ConfirmmailComponent,
  },
  {
    path: 'email-verification',
    component: EmailverificationComponent,
  },
  {
    path: 'two-step-verification',
    component: SteptwoverificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
