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
import { Select2Data } from 'ng-select2-component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';

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
  @ViewChild('withdraw') withdrawRef: any;
  config = new AppConfig();

  uid = "";
  email = "";

  total_ngn_bal = 0;
  total_frozen_ngn_bal = 0;

  total_usdt_bal = 0;
  total_frozen_usdt_bal = 0;

  total_bnb = 0;

  proccess_orders = 0;
  total_transactions = 0;

  fundingAmount: string = "0";
  withdrawAmount = "0";
  feeAmount = 0;

  displayWithdrawalForm = true;

  bankAcctNumber = "";
  bankAcctName = "";

  banks:any[] = [];
  bankList:any[] = [];
  selectedUserBank:any;

  selectedBankFromList = "";

  button_pressed = false;

  data:Select2Data = [];

  showSpinner = false;

  selectedBank:any;

  routeAction:any;

  constructor(private modalService: NgbModal, 
    private flutterwave: Flutterwave, 
    private toastr: ToastrService, 
    private http:HttpClient,
    private router: Router,
    private clipboard: Clipboard,
    private route:ActivatedRoute) {
      const r = this.route.snapshot.params.action;
      if(r !== undefined) {
        this.routeAction = r;
      }
     }

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
    this.getBalances();
    this.getProcessedOrders();
    this.getUserBanks();

    if(this.routeAction !== undefined) {
      if(this.routeAction === "fund") {
        this.addFunds();
        return;
      }
      if(this.routeAction === "withdraw") {
        this.withdrawFunds();
        return;
      }
      this.router.navigate(["/404"]);
    }
  }

  getProcessedOrders() {
    firebase.firestore().collection("p2p-transactions").where("created_by.user_id", "==", this.uid).onSnapshot(query => {
      if (!query.empty) {
        this.proccess_orders = query.size;
      }
    });

    firebase.firestore().collection("token-transactions").where("created_by.user_id", "==", this.uid).onSnapshot(query => {
      if (!query.empty) {
        this.total_transactions = query.size;
      }
    });
  }

  getBalances() {
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

    firebase.firestore().collection("users").doc(this.uid).collection("wallet").doc("usdt-wallet").onSnapshot(query => {
      if (query.exists) {
        const dt = query.data();
        if (dt === undefined) {
          return;
        }
        // this.total_usdt_bal = dt["total-amount"];
        this.total_frozen_usdt_bal = dt["frozen-amount"];
      }
    });

    this.http.get(`https://us-central1-cryptopeer2peer.cloudfunctions.net/getwalletbalance?uid=${this.uid}`).subscribe((res:any) => {
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

  getUserBanks() {
    firebase.firestore().collection("users").doc(this.uid).collection("banks").onSnapshot(query => {
      if(!query.empty) {
        this.banks = [];
        query.docs.forEach(bank => {
          const dt = bank.data();
          this.banks.push(dt);
        });
      }
    })
  }

  addFunds() {
    this.modalService.open(this.content, { centered: true });
  }

  formatFundingAmt(evt: any) {
    this.fundingAmount = this.config.getFormattedAmount("NGN", Number(evt.target.value)).split(" ")[1];
  }

  async openFlutterwave() {
    const amt = Number(this.fundingAmount);
    if(amt < 10) {
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
    this.modalService.open(this.withdrawRef, { centered: true });
    this.getNGBankList();
  }

  toggleAddNewAccount() {
    this.displayWithdrawalForm = !this.displayWithdrawalForm;
  }

  getNGBankList() {
    this.http.get("https://us-central1-cryptopeer2peer.cloudfunctions.net/getnigeriabanks").subscribe((res:any) => {
      if(res["error"]) {
        this.toastr.error(res["message"]);
        return;
      }
      const mBanks:any[] = res["data"];
      this.bankList = [];
      mBanks.forEach(mBank => {
        this.bankList.push({
          value: mBank["name"],
          label: mBank["name"],
          data: {
            name: mBank["name"],
          },
          templateId: `${mBank["id"]}`,
          id: mBank["code"],
        });
      });
      this.data = [
        {
          label: 'Banks',
          data: {
            name: 'Banks',
          },
          options: this.bankList
        },
      ];
    }, err => {
      this.toastr.error("Could not fetch banks");
    });
  }

  verifyUserBankAccount(evt:any) {
    if(this.bankAcctNumber.length < 10 || this.bankAcctNumber.length > 10 || this.selectedBankFromList === "" || this.selectedBankFromList === undefined){
      return;
    }

    this.showSpinner = true;

    const getBankCode = this.bankList.find((val, ind, arr) => {
      return val.value === this.selectedBankFromList;
    }).id;

    this.http.get(`https://us-central1-cryptopeer2peer.cloudfunctions.net/verifyaccount?bank=${getBankCode}&account=${this.bankAcctNumber}`).subscribe((res:any) => {
      this.showSpinner = false;  
      if(res["error"]) {
        this.toastr.error(res["message"]);
        return;
      }
      const data = res["data"];
      this.bankAcctName = data["account_name"];
    }, err => {
      this.showSpinner = false;  
      this.toastr.error("Invalid query parameters.");
    });
  }

  getTransferRate(evt:any) {
    this.showSpinner = true;
    const amount = evt.target.value;

    this.http.get(`https://us-central1-cryptopeer2peer.cloudfunctions.net/fectchtransfersfee?amount=${amount}`).subscribe((res:any) => {
      this.showSpinner = false;
      if(res["error"]) {
        this.toastr.error(res["message"]);
        return;
      }
      const fees:any[] = res["data"];
      this.feeAmount = fees.filter((val,ind,arr) => {
        return val.currency === "NGN";
      })[0].fee;
    }, err => {
      this.showSpinner = false;  
      this.toastr.error("Invalid query parameters.");
    });
  }

  async saveBankAccount() {
    if(this.bankAcctName === "" || this.bankAcctNumber === "" || this.selectedBankFromList === "") {
      this.toastr.error("Please fill all fields");
      return;
    }

    const key =  firebase.firestore().collection("users").doc(this.uid).collection("banks").doc().id;

    const getBankCode = this.bankList.find((val, ind, arr) => {
      return val.value === this.selectedBankFromList;
    }).id;

    const getBankName = this.bankList.find((val, ind, arr) => {
      return val.value === this.selectedBankFromList;
    }).value;

    const bankExists = this.banks.find((val, ind, arr) => {
      return val.bank_code === getBankCode && val.bank_account_number === this.bankAcctNumber;
    });

    if(bankExists !== undefined) {
      this.toastr.error("Bank account already exist.");
      return;
    }

    this.button_pressed = true;

    const bank = {
      id: key,
      bank_code: getBankCode,
      bank_name: getBankName,
      bank_account_number: this.bankAcctNumber,
      bank_account_holder: this.bankAcctName
    }

    try {
      await firebase.firestore().collection("users").doc(this.uid).collection("banks").doc(key).set(bank);
      this.button_pressed = false;
      this.toastr.success("Bank added successfully.");
      this.toggleAddNewAccount();
    }catch(err) {
      this.button_pressed = false;
      this.toastr.error(`${err}`);
    }
    
  }

  setBank(evt: any) {
    this.selectedBank = this.banks.find((val,ind,arr) => {
      return val.id === evt.target.value;
    });
  }

  withdrawFundsToAccount() {
    const amt = Number(this.withdrawAmount);
    if(amt < 1000) {
      this.toastr.error("Minimum amount to withdraw is ₦1,000");
      return;
    }

    if(this.selectedUserBank === undefined || this.selectedUserBank === ""){
      this.toastr.error("Invalid bank account selection.");
      return;
    }

    const getBank = this.banks.find((val,ind,arr) => {
      return val.id === this.selectedUserBank;
    });

    if(getBank === undefined) {
      this.toastr.error("Invalid bank account selection.");
      return;
    }

    this.button_pressed = true;

    this.http.get(`https://us-central1-cryptopeer2peer.cloudfunctions.net/withdrawfunds?uid=${this.uid}&amount=${this.withdrawAmount}&fee=${this.feeAmount}&account_bank=${getBank.bank_code}&account_number=${getBank.bank_account_number}`).subscribe((res:any) => {
      this.button_pressed = false;
      if(res["error"]) {
        this.toastr.error(res["message"]);
        return;
      }
      this.modalService.dismissAll();
      this.toastr.success(res["message"]);
      this.selectedUserBank = "";
      this.withdrawAmount = "";
      this.bankAcctNumber = "";
      this.selectedBankFromList = "";
      this.bankAcctName = "";
    }, err => {
      this.button_pressed = false;
      this.toastr.error(`${err}`);
    });
  }

  sendUSDT() {
    this.router.navigate(["/tokens/withdraw/usdt"]);
  }

  receiveUSDT() {
    this.router.navigate(["/tokens/deposit/usdt"]);
  }

  receiveBNB() {
    this.router.navigate(["/tokens/deposit/bnb"]);
  }

  sendBNB() {
    this.router.navigate(["/tokens/withdraw/bnb"]);
  }

  viewOrders() {
    this.router.navigate(["/p2p/orders/history"]);
  }

  ViewMyOrders() {
    this.router.navigate(["/p2p/my-orders"]);
  }

  createOrder() {
    this.router.navigate(["/p2p/new-order"]);
  }

  async copyWalletAddress() {
    const query = await firebase.firestore().collection("users").doc(this.uid).get();
    if(!query.exists){
      this.toastr.error("Invalid user. Please login again.");
      return;
    }
    const user = query.data();
    if(user === undefined){
      this.toastr.error("Invalid user. Please login again.");
      return;
    }
    const address = user.address;
    this.clipboard.copy(address);
    this.toastr.success("Wallet address copied!");
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
