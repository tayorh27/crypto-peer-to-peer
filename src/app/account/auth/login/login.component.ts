import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';
import { environment } from '../../../../environments/environment';
import { LAYOUT_MODE } from '../../../layouts/layouts.model';
import { ToastrService } from 'ngx-toastr';
import { Moralis } from 'moralis';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import { CryptoUser } from 'src/app/core/models/user.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  layout_mode!: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  loginForm!: FormGroup;
  submitted = false;
  returnUrl!: string;
  error = '';
  button_pressed = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private toastr: ToastrService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if (this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
    //Validation Set
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.button_pressed = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value).then(async (res: any) => {
          const user = await firebase.firestore().collection("users").doc(res.uid).get();
          if(!user.exists) {
            this.button_pressed = false;
            await firebase.auth().signOut();
            this.toastr.error("Account does not exist.");
            return;
          }
          const dt = <CryptoUser>user.data();
          if(dt.blocked) {
            this.button_pressed = false;
            await firebase.auth().signOut();
            this.toastr.error("Account has been blocked. Contact support.");
            return;
          }

          localStorage.setItem("name", dt.name);
          const moralisUser = new Moralis.User();
          moralisUser.set("username", `${this.f.email.value}`.toLowerCase());
          moralisUser.set("password", this.f.password.value);
          moralisUser.set("email", `${this.f.email.value}`.toLowerCase());

          try{
            moralisUser.logIn();
          }catch (error:any) {
            this.button_pressed = false;
            await firebase.auth().signOut();
            this.toastr.error(error.message);
          }
          this.router.navigate(['']);
        })
          .catch((error: string) => {
            this.button_pressed = false;
            this.error = error ? error : '';
            this.toastr.error(this.error);
          });
      } else {
        this.authFackservice.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
            (data: any) => {
              this.router.navigate(['']);
            },
            (error: string) => {
              this.error = error ? error : '';
            });
      }
    }
  }

}
