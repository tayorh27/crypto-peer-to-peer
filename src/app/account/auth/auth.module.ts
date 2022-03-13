import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgOtpInputModule } from  'ng-otp-input';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecoverpwdComponent } from './recoverpwd/recoverpwd.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { ConfirmmailComponent } from './confirmmail/confirmmail.component';
import { EmailverificationComponent } from './emailverification/emailverification.component';
import { SteptwoverificationComponent } from './steptwoverification/steptwoverification.component';
import { Login1Component } from './login1/login1.component';
import { Register1Component } from './register1/register1.component';
import { Recoverpwd1Component } from './recoverpwd1/recoverpwd1.component';
import { NgbToastModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RecoverpwdComponent,
    LockscreenComponent,
    ConfirmmailComponent,
    EmailverificationComponent,
    SteptwoverificationComponent,
    Login1Component,
    Register1Component,
    Recoverpwd1Component
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    NgbToastModule,
    NgbAlertModule
  ]
})
export class AuthModule { }
