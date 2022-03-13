import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../core/services/auth.service';
import { LAYOUT_MODE } from '../../../layouts/layouts.model';

import firebase from 'firebase/app';
import "firebase/firestore";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recoverpwd',
  templateUrl: './recoverpwd.component.html',
  styleUrls: ['./recoverpwd.component.scss']
})

/**
 * Recover-Password Component
 */
export class RecoverpwdComponent implements OnInit {

  resetForm!: FormGroup;
  layout_mode!: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  submitted = false;
  error = '';
  success = '';
  button_pressed = false

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
    //Validation set
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }
  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;
    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    if (environment.defaultauth === 'firebase') {
      this.button_pressed = true
      this.authenticationService.resetPassword(this.f.email.value).then((res) => {
        this.button_pressed = false;
        this.toastr.success("Instructions sent to your email.");
      })
        .catch(error => {
          this.button_pressed = false;
          this.error = error ? error : '';
          this.toastr.error(this.error);
        });
    }
  }

}
