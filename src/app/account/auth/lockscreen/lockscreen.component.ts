import { Component, OnInit } from '@angular/core';
import { LAYOUT_MODE } from '../../../layouts/layouts.model';
import firebase from 'firebase/app';
import "firebase/auth";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})

/**
 * Lock-Screen Component
 */
export class LockscreenComponent implements OnInit {

  layout_mode!: string;

  password = "";

  // set the currenr year
  year: number = new Date().getFullYear();

  name = localStorage.getItem("name");

  button_pressed = false;
  error = "";
  email = "";

  constructor(private router:Router, private toastr:ToastrService, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }

    if(this.name !== null) {
      this.name = this.name.split(" ")[0];
    }

    let data = sessionStorage.getItem("authUser");
    if(data == null) {
      data = "{}"
    }
    var json = JSON.parse(data);
    this.email = json.email;
  }

  verifyPassword() {
    if(this.password === "") {
      this.toastr.error("Fill in your password");
      return;
    }
    this.button_pressed = true;
    this.authenticationService.login(this.email.toLowerCase(), this.password).then(user => {
      this.toastr.success("Logged in successfully.");
      localStorage.removeItem("isLocked");
      this.router.navigate(['']);
    })
    .catch((error: string) => {
      this.button_pressed = false;
      this.error = error ? error : '';
      this.toastr.error(this.error);
    });
  }

}
