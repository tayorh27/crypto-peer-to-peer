import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../core/services/auth.service';
import { UserProfileService } from '../../../core/services/user.service';
import { LAYOUT_MODE } from '../../../layouts/layouts.model';

import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { CryptoUser } from 'src/app/core/models/user.models';

import firebase from 'firebase/app';
import 'firebase/firestore'
import Moralis from 'moralis';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

/**
 * Register Component
 */
export class RegisterComponent implements OnInit {
  layout_mode!: string;

  signupForm!: FormGroup;
  submitted = false;
  button_pressed = false
  successmsg = false;
  error = '';
  show = false

  config = new AppConfig();

  // set the currenr year
  year: number = new Date().getFullYear();

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserProfileService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    // Moralis.User.logOut();
    this.layout_mode = LAYOUT_MODE
    if (this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }

    // Validation Set
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phonenumber: ['', Validators.required]
    });
  }

  // closeToast() {
  //   setTimeout(() => this.error = '', 8000);
  // }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */
  async onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    } else {
      this.button_pressed = true
      if (environment.defaultauth === 'firebase') {
        const moralisUser = new Moralis.User();
        moralisUser.set("username", `${this.f.email.value}`.toLowerCase());
        moralisUser.set("password", this.f.password.value);
        moralisUser.set("email", `${this.f.email.value}`.toLowerCase());

        // other fields can be set just like with Moralis.Object
        moralisUser.set("phone", this.f.phonenumber.value);
        try {
          const mu = await moralisUser.signUp();
          this.authenticationService.register(`${this.f.email.value}`.toLowerCase(), this.f.password.value).then((res) => {
            const user: CryptoUser = {
              id: res.uid,
              email: `${this.f.email.value}`.toLowerCase(),
              phone_number: this.config.formatNumber(this.f.phonenumber.value),
              name: this.f.username.value,
              image: 'assets/images/default-avatar.png',
              user_type: 'crypto_user',
              user_role_type: 'owner',
              email_verified: false,
              blocked: false,
              role: '',
              access_levels: '',
              created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
              modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              msgID: []
            }
            this.authenticationService.uploadUserData(res.uid, user).then(async (rs) => {
              this.button_pressed = false;
              localStorage.setItem("name", user.name);
              // await moralisUser.logIn();
              this.router.navigate(['/account/email-verification']);
            }).catch((error: string) => {
              this.button_pressed = false;
              this.authenticationService.logout()
              this.error = error ? error : '';
              this.show = true
            });
  
          })
            .catch((error: string) => {
              this.button_pressed = false;
              this.error = error ? error : '';
              this.show = true
            });
        } catch (error:any) {
          this.button_pressed = false;
          // Show the error message somewhere and let the user try again.
          this.toastr.error(error.message);
        }
      } else {
        this.userService.register(this.signupForm.value)
          .pipe(first())
          .subscribe(
            (data: any) => {
              this.successmsg = true;
              if (this.successmsg) {
                this.router.navigate(['/account/login']);
              }
            },
            (error: any) => {
              this.error = error ? error : '';
            });
      }
    }
  }

}
