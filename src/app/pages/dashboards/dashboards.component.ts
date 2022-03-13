import { Component, OnInit, ViewChild } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart, transactions, orders, users } from './data';
import { ChartType } from './dashboard.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Moralis from 'moralis';
import firebase from 'firebase/app';
import "firebase/firestore";
import { AppConfig } from 'src/app/core/services/global.service';
import { AsyncPaymentOptions, Flutterwave } from 'flutterwave-angular-v3';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})

/**
 * Dashboard Component
 */
export class DashboardsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  emailSentBarChart!: ChartType;
  monthlyEarningChart!: ChartType;
  transactions: any;
  orders: any;
  users: any;
  show = false;
  @ViewChild('content') content: any;
  config = new AppConfig();

  uid = "";
  email = "";

  total_ngn_bal = 0;
  total_frozen_ngn_bal = 0;

  total_usdt_bal = 0;
  total_frozen_usdt_bal = 0;

  proccess_orders = 0;

  fundingAmount: string = "0";

  constructor(private modalService: NgbModal, private flutterwave: Flutterwave, private toastr: ToastrService) { }

  ngOnInit(): void {

    let data = sessionStorage.getItem("authUser");
    if (data == null) {
      data = "{}"
    }
    var json = JSON.parse(data);
    this.uid = json.uid;
    this.email = json.email;

    // const chain = Moralis.Chains.BSC_TESTNET;

    // console.log(Moralis.network);
    // console.log(Moralis.chainId);
    // console.log(Moralis.getChainId());

    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Dashboard', active: true }
    ];

    /**
     * Fetches the data
     */
    this.fetchData();
    this.getNGNBalance();
    this.getProcessedOrders();
  }

  getProcessedOrders() {
    firebase.firestore().collection("order-transactions").where("created_by.uid", "==", this.uid).onSnapshot(query => {
      if (!query.empty) {
        this.proccess_orders = query.size;
      }
    });
  }

  getNGNBalance() {
    firebase.firestore().collection("users").doc(this.uid).collection("wallet").doc("ngn-wallet").onSnapshot(query => {
      if (query.exists) {
        const dt = query.data();
        if (dt === undefined) {
          return;
        }
        this.total_ngn_bal = dt["total-amount"];
        this.total_frozen_ngn_bal = dt["frozen-amount"];
      }
    });

  }

  addFunds() {
    this.modalService.open(this.content, { centered: true });
  }

  formatFundingAmt(evt: any) {
    this.fundingAmount = this.config.getFormattedAmount("NGN", Number(evt.target.value)).split(" ")[1];
  }

  async openFlutterwave() {
    const amt = Number(this.fundingAmount);
    if(amt < 1000) {
      this.toastr.error("Minimum amount is ₦1,000");
      return;
    }
    const customerDetails = {
      name: localStorage.getItem("name"),
      email: this.email,
    }

    const meta = {
      'counsumer_id': this.uid,
    }

    const paymentData: AsyncPaymentOptions = {
      public_key: environment.flutterwavePubKey,
      tx_ref: new Date().getTime().toString(),
      amount: Number(this.fundingAmount),
      currency: 'NGN',
      payment_options: 'card',
      meta: meta,
      customer: customerDetails,
    }

    try {
      const res = await this.flutterwave.asyncInlinePay(paymentData);
      if(res === "closed") {
        return;
      }
      this.flutterwave.closePaymentModal();
      this.toastr.success("Amount successfully added to wallet");
      console.log(res);
    } catch (err) {
      this.toastr.error(`${err}`);
    }

  }

  withdrawFunds() {
    this.modalService.open(this.content, { centered: true });
  }

  sendUSDT() {

  }

  receiveUSDT() {

  }

  viewOrders() {

  }

  createOrder() {

  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.openModal();
    // }, 2000);
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;
    this.transactions = transactions;
    this.orders = orders;
    this.users = users;
  }

  /***
   * Subscribe Model open
   */
  openModal() {
    this.modalService.open(this.content, { centered: true });
  }
}
