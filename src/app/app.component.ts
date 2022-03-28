import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import Moralis from 'moralis';
import { environment } from 'src/environments/environment';
import { CryptoUser } from './core/models/user.models';
import { AuthenticationService } from './core/services/auth.service';
import { AppConfig } from './core/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  config = new AppConfig();

  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.checkblockeduser();
  }

  checkblockeduser() {
    const uid = this.authService.getLocalStorageUserData().uid;
    if (uid === undefined || uid === null) {
      return;
    }
    firebase.firestore().collection('users').doc(uid).onSnapshot(user => {
      const m = <CryptoUser>user.data();
      if (m != null) {
        const blocked: boolean = m.blocked;
        if (blocked) {
          this.logout();
        }
      }
    })
  }

  async logout() {
    if (environment.defaultauth === 'firebase') {
      await Moralis.User.logOut();
      await this.authService.logout();
    }
    this.router.navigate(['/account/login']);
  }

}
