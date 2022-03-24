import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { LAYOUT_MODE } from 'src/app/layouts/layouts.model';
import firebase from 'firebase/app';
import "firebase/firestore";
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { P2P } from 'src/app/core/models/p2p.model';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  layout_mode!: string;
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  constructor(private formBuilder: FormBuilder, 
    private authService: AuthenticationService, 
    private toastr: ToastrService, 
    private http: HttpClient,
    private router:Router) { }

  orderForm!: FormGroup;
  button_pressed = false;
  submitted = false;

  total_ngn_bal = 0;
  total_frozen_ngn_bal = 0;

  total_usdt_bal = 0;
  total_frozen_usdt_bal = 0;

  ngOnInit(): void {
    // this.layout_mode = LAYOUT_MODE
    // if (this.layout_mode === 'dark') {
    //   document.body.setAttribute("data-layout-mode", "dark");
    // }
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'P2p' },
      { label: 'Create Order', active: true }
    ];
    //Validation Set
    this.orderForm = this.formBuilder.group({
      type: ['', [Validators.required]],
      asset: ['usdt', [Validators.required]],
      total: ['', [Validators.required]],
      limit_min: ['', [Validators.required]],
      limit_max: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });
    this.getBalances();
  }

  async getBalances() {
    const uid = this.authService.getLocalStorageUserData().uid;

    const query = await firebase.firestore().collection("users").doc(uid).collection("wallet").doc("ngn-wallet").get();
    if (query.exists) {
      const dt = query.data();
      if (dt === undefined) {
        return;
      }
      this.total_ngn_bal = dt["total-amount"];
      this.total_frozen_ngn_bal = dt["frozen-amount"];
    }

    const usdtQ = await firebase.firestore().collection("users").doc(uid).collection("wallet").doc("usdt-wallet").get();
    if (usdtQ.exists) {
      const dt = usdtQ.data();
      if (dt === undefined) {
        return;
      }
      // this.total_ngn_bal = dt["total-amount"];
      this.total_frozen_usdt_bal = dt["frozen-amount"];
    }

    this.http.get(`https://us-central1-cryptopeer2peer.cloudfunctions.net/getwalletbalance?uid=${uid}`).subscribe((res:any) => {
      if(res["error"]) {
        this.toastr.error(res["message"]);
        return;
      }
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

  // convenience getter for easy access to form fields
  get f() { return this.orderForm.controls; }

  async onSubmit() {
    this.submitted = true;
    if (this.orderForm.invalid) {
      return;
    }

    if(this.f.type.value === "buy") {
      if(Number(this.f.total.value) > this.total_ngn_bal) {
        this.toastr.error("Total amount cannot be more than NGN account balance.");
        return;
      }
    }

    if(this.f.type.value === "sell") {
      if(Number(this.f.total.value) > this.total_usdt_bal) {
        this.toastr.error("Total amount cannot be more than USDT account balance.");
        return;
      }
    }

    if(Number(this.f.limit_max.value) > Number(this.f.total.value)) {
      this.toastr.error("Maximum limit order cannot be more than total amount.");
      return;
    }

    if(Number(this.f.limit_min.value) > Number(this.f.limit_max.value)) {
      this.toastr.error("Maximum limit order cannot be more than minimum limit order.");
      return;
    }

    try {
      const key = firebase.firestore().collection("p2p-orders").doc().id;

      const uid = this.authService.getLocalStorageUserData().uid;

      const currentUser = await this.authService.getUserData(uid);

      if (currentUser === null) {
        this.toastr.error("Invalid user. Please refresh to login again.");
        return;
      }

      this.button_pressed = true;

      const mths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

      const data:P2P = {
        id: key,
        order_id: `${key.substring(1, 8)}`,
        order_type: this.f.type.value,
        listed_as: this.f.type.value === "sell" ? "buy" : "sell",
        order_asset: this.f.asset.value,
        total_amount: Number(this.f.total.value),
        initial_total_amount: Number(this.f.total.value),
        order_price: Number(this.f.price.value),
        order_limit_min: Number(this.f.limit_min.value),
        order_limit_max: Number(this.f.limit_max.value),
        status: "processing",
        currency: "NGN",
        country: "Nigeria",
        is_user_ordering: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
      }

      await firebase.firestore().collection("p2p-orders").doc(key).set(data);
      this.orderForm.reset();
      this.button_pressed = false;
      this.toastr.success("Order created successfully.");
      this.router.navigate(["/"]);
    } catch (err) {
      this.button_pressed = false;
      this.toastr.error(`${err}`);
    }
  }

}
