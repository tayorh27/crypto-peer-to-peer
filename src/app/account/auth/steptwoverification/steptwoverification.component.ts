import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/core/services/global.service';
import { LAYOUT_MODE } from '../../../layouts/layouts.model';

import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

@Component({
  selector: 'app-steptwoverification',
  templateUrl: './steptwoverification.component.html',
  styleUrls: ['./steptwoverification.component.scss']
})

/**
 * Step-Two-Verification Component
 */
export class SteptwoverificationComponent implements OnInit {
  layout_mode!: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  email = "";
  username = "";
  error = "";
  otpcode = "";
  inputcode = "";
  config =new AppConfig();

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }

    this.otpcode = `${this.config.randomInt(1000,9999)}`

    let data = sessionStorage.getItem("authUser");
    if(data == null) {
      data = "{}"
    }
    var json = JSON.parse(data);
    this.email = json.email;
    // this.username = json.name;

    this.sendOtpCode()
  }

  /***
   * confirm otp
   */
  otpconfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '80px',
      'height': '50px'
    }
  };

  onOTP(evt:any) {
    this.inputcode = evt;
  }

  resendCode() {
    this.sendOtpCode();
  }

  async sendOtpCode() {
    const header = "EMAIL VERIFICATION"
    const msg = `Your verification code is ${this.otpcode}.`
    const content = `Hi ${this.username},<br><br>${msg}<br><br>Best wishes.`;

    // await this.config.sendGeneralEmail(this.email, header, msg);
    await firebase.firestore().collection("mail").add({
      to: this.email,
      message: {
          subject: header,
          html: content,
      },
    });
    this.toastr.success("Verification code sent.")
  }

  async confirmCode() {
    if(this.otpcode !== this.inputcode) {
      this.toastr.error("Incorrect verification code.")
      return;
    }
    const uid = firebase.auth().currentUser?.uid;
    await firebase.firestore().collection("users").doc(uid).update({
      "email_verified": true
    })
    this.toastr.success("Verification successful.")
    location.href = '/'
  }

}
