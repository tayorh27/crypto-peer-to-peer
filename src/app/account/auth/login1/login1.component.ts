import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LAYOUT_MODE } from '../../../layouts/layouts.model';

@Component({
  selector: 'app-login1',
  templateUrl: './login1.component.html',
  styleUrls: ['./login1.component.scss']
})

/**
 * Login1 Component
 */
export class Login1Component implements OnInit {
  layout_mode!: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  loginForm!: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { }
  
  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
    //Validation Set
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
   
  /**
  * Bootsrap validation form submit method
  */
  onSubmit() {
      this.submitted = true;
  }

}
