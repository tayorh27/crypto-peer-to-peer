import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import firebase from 'firebase/app';
import "firebase/firestore";
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  total_ngn_bal = 0;
  total_frozen_ngn_bal = 0;

  total_usdt_bal = 0;
  total_frozen_usdt_bal = 0;

  total_bnb = 0;

  selectedTab = "deposit";
  selectedToken = "usdt";

  selectedNetwork = "bsc";
  walletAddress = "";

  constructor(private http:HttpClient, 
              private authService:AuthenticationService, 
              private toastr:ToastrService, 
              private router:Router, 
              private activatedRouter:ActivatedRoute,
              private clipboard: Clipboard,
              private formBuilder: FormBuilder, ) {
    const route = this.activatedRouter.snapshot.params.id;
    const routeToken = this.activatedRouter.snapshot.params.token;
    if(route !== undefined) {
      this.selectedTab = route;
    }
    if(routeToken !== undefined) {
      this.selectedToken = routeToken;
    }
   }

   withdrawForm!: FormGroup;
   button_pressed = false;
   submitted = false;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Tokens' },
      { label: '', active: true }
    ];
    this.withdrawForm = this.formBuilder.group({
      address: ['', [Validators.required]],
      amount: ['0', [Validators.required]],
    });
    this.getWalletAddress();
    this.getBalances();
  }

  getBalances() {
    const uid = this.authService.getLocalStorageUserData().uid;
    firebase.firestore().collection("users").doc(uid).collection("wallet").doc("ngn-wallet").onSnapshot(query => {
      if (query.exists) {
        const dt = query.data();
        if (dt === undefined) {
          return;
        }
        this.total_ngn_bal = dt["total-amount"];
        this.total_frozen_ngn_bal = dt["frozen-amount"];
      }
    });

    firebase.firestore().collection("users").doc(uid).collection("wallet").doc("usdt-wallet").onSnapshot(query => {
      if (query.exists) {
        const dt = query.data();
        if (dt === undefined) {
          return;
        }
        // this.total_usdt_bal = dt["total-amount"];
        this.total_frozen_usdt_bal = dt["frozen-amount"];
      }
    });

    this.http.get(`https://us-central1-cryptopeer2peer.cloudfunctions.net/getwalletbalance?uid=${uid}`).subscribe((res:any) => {
      if(res["error"]) {
        this.toastr.error(res["message"]);
        return;
      }
      this.total_bnb = res["native"];
      const tokens:any[] = res["tokens"];
      if(tokens.length === 0) {
        return;
      }
      const usdt = tokens.find((val, ind, arr) => {
        return val.symbol === "USDT";
      });
      this.total_usdt_bal = (usdt.balance / (Math.pow(10, usdt.decimals)));
    });

  }

  async getWalletAddress() {
    const uid = this.authService.getLocalStorageUserData().uid;
    const query = await firebase.firestore().collection("users").doc(uid).get();
    if(!query.exists){
      this.toastr.error("Invalid user. Please login again.");
      return;
    }
    const user = query.data();
    if(user === undefined){
      this.toastr.error("Invalid user. Please login again.");
      return;
    }
    this.walletAddress = user.address;
  }

  copyAddress() {
    this.clipboard.copy(this.walletAddress);
    this.toastr.success("Wallet address copied!");
  }

  setMaxToken() {
    if(this.selectedToken === "usdt") {
      this.f.amount.setValue(`${this.total_usdt_bal}`);
      return;
    }
    if(this.selectedToken === "bnb") {
      this.f.amount.setValue(`${this.total_bnb}`);
      return;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.withdrawForm.controls; }

  async onSubmit() {
    this.submitted = true;
    if(this.withdrawForm.invalid) {
      return;
    }
  }

}
