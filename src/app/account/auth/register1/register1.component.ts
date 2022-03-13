import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LAYOUT_MODE } from '../../../layouts/layouts.model';

@Component({
  selector: 'app-register1',
  templateUrl: './register1.component.html',
  styleUrls: ['./register1.component.scss']
})

/**
 * Register1 Component
 */
export class Register1Component implements OnInit {
  layout_mode!: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  registerForm!: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
  }

}
