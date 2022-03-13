import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LAYOUT_MODE } from '../../../layouts/layouts.model';

@Component({
  selector: 'app-recoverpwd1',
  templateUrl: './recoverpwd1.component.html',
  styleUrls: ['./recoverpwd1.component.scss']
})

/**
 * Recover-Password1 Component
 */
export class Recoverpwd1Component implements OnInit {
  layout_mode!: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  recoverForm!: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.recoverForm.controls; }

  onSubmit() {
      this.submitted = true;
  }

}
