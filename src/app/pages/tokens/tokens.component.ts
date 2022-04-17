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

  network_fee = 0;
  receiver_amount = 0;

  selectedTab = "deposit";
  selectedToken = "usdt";

  selectedNetwork = "bsc";
  walletAddress = "";

  constructor(private http: HttpClient,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private clipboard: Clipboard,
    private formBuilder: FormBuilder,) {
    const route = this.activatedRouter.snapshot.params.id;
    const routeToken = this.activatedRouter.snapshot.params.token;
    if (route !== undefined) {
      this.selectedTab = route;
    }
    if (routeToken !== undefined) {
      if(routeToken !== "usdt") {
        this.toastr.error("Invalid token selected");
        location.href = "/";
        return;
      }
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
        this.total_frozen_usdt_bal = dt["frozen-amount"];
      }
    });

    this.http.get(`https://us-central1-cryptopeer2peer.cloudfunctions.net/getwalletbalance?uid=${uid}`).subscribe((res: any) => {
      if (res["error"]) {
        this.toastr.error(res["message"]);
        return;
      }
      this.total_bnb = res["native"];
      const tokens: any[] = res["tokens"];
      if (tokens.length === 0) {
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
    if (!query.exists) {
      this.toastr.error("Invalid user. Please login again.");
      return;
    }
    const user = query.data();
    if (user === undefined) {
      this.toastr.error("Invalid user. Please login again.");
      return;
    }
    this.walletAddress = user.address;
  }

  copyAddress() {
    this.clipboard.copy(this.walletAddress);
    this.toastr.success("Wallet address copied!");
  }

  setTokenAmount(evt:any) {
    const amt = evt.target.value;
    if (this.selectedToken === "usdt") {
      this.network_fee = 0.6; //binance = 0.8
      this.receiver_amount = Number(amt) - this.network_fee;
      return;
    }
    if (this.selectedToken === "bnb") {
      this.network_fee = 0.00035; //binance = 0.0005
      this.receiver_amount = Number(amt) - this.network_fee;
      return;
    }
  }

  setMaxToken() {
    if (this.selectedToken === "usdt") {
      this.f.amount.setValue(`${this.total_usdt_bal}`);
      this.network_fee = 0.6; //binance = 0.8
      this.receiver_amount = Number(this.f.amount.value) - this.network_fee;
      return;
    }
    if (this.selectedToken === "bnb") {
      this.f.amount.setValue(`${this.total_bnb}`);
      this.network_fee = 0.00035; //binance = 0.0005
      this.receiver_amount = Number(this.f.amount.value) - this.network_fee;
      return;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.withdrawForm.controls; }

  async onSubmit() {
    this.submitted = true;
    if (this.withdrawForm.invalid) {
      return;
    }

    if (this.selectedToken === "usdt") {
      if (Number(this.f.amount.value > this.total_usdt_bal)) {
        this.toastr.error("Total amount cannot be more than USDT account balance.");
        return;
      }

      if (Number(this.f.amount.value < 5)) {  //binancee = 10
        this.toastr.error("Amount cannot be less 5 USDT.");
        return;
      }
    }

    if (this.selectedToken === "bnb") {
      if (Number(this.f.amount.value > this.total_bnb)) {
        this.toastr.error("Total amount cannot be more than BNB account balance.");
        return;
      }

      if (Number(this.f.amount.value < 0.005)) { //binancee = 0.01
        this.toastr.error("Amount cannot be less 0.005 BNB.");
        return;
      }
    }

    const key = firebase.firestore().collection("token-transactions").doc().id;
    const mths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const uid = this.authService.getLocalStorageUserData().uid;

    const currentUser = await this.authService.getUserData(uid);

    if (currentUser === null) {
      this.toastr.error("Invalid user. Please refresh to login again.");
      return;
    }

    this.button_pressed = true;

    try {
      const transaction = {
        id: key,
        token: this.selectedToken,
        network: this.selectedNetwork,
        amount: Number(this.f.amount.value),
        address: this.f.address.value,
        status: "processing",
        type: "withdraw",
        created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        created_by: {
          user_id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
          msgId: currentUser.msgID,
          image: currentUser.image,
          number: currentUser.phone_number,
        },
        year: new Date().getFullYear(),
        month: mths[new Date().getMonth()],
        day: new Date().getDate(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }
      await firebase.firestore().collection("token-transactions").doc(key).set(transaction);
      this.withdrawForm.reset();
      this.button_pressed = false;
      this.toastr.success("Transaction is processing...");
      this.router.navigate(["/"]);
    } catch(err) {
      this.button_pressed = false;
      this.toastr.error(`${err}`);
    }
  }

}
