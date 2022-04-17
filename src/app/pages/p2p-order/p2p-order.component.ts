import { Component, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { LAYOUT_MODE } from 'src/app/layouts/layouts.model';
import firebase from 'firebase/app';
import "firebase/firestore";
import { AdvancedService } from 'src/app/core/tables/table.service';
import { DecimalPipe } from '@angular/common';
import { Observable, of, Subscription } from 'rxjs';
import { AdvancedSortableDirective, SortEvent } from 'src/app/core/tables/table.sortable.directive';
import { P2P } from 'src/app/core/models/p2p.model';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NavigationStart, Router } from '@angular/router';
import { AppConfig } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-p2p-order',
  templateUrl: './p2p-order.component.html',
  styleUrls: ['./p2p-order.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class P2POrderComponent implements OnInit, OnDestroy {

  subscription:Subscription;
  layout_mode!: string;
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  @Input() showBreadCrumb = true;

  @Input() total_ngn_bal = 0;
  @Input() total_frozen_ngn_bal = 0;

  @Input() total_usdt_bal = 0;
  @Input() total_frozen_usdt_bal = 0;
  @Input() isDashboard = false;

  tableData!: P2P[];
  reservedTableData!: P2P[];
  hideme: boolean[] = [];
  tables$: Observable<P2P[]>;
  total$: Observable<number>;
  @ViewChildren(AdvancedSortableDirective)
  headers!: QueryList<AdvancedSortableDirective>;

  @ViewChild("buyContent") buyContent: any;
  @ViewChild("sellContent") sellContent: any;

  selectedOrderId = "";
  selectedP2P: any;
  config = new AppConfig();

  public isCollapsed = true;
  constructor(private router:Router, public service: AdvancedService, private http: HttpClient, private modalService: NgbModal, private toastr: ToastrService, private authService: AuthenticationService) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;

    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if(!router.navigated) {
          console.log("refreshing");
          this.updateP2PData();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.updateP2PData();
  }

  async updateP2PData() {
    if(this.selectedOrderId === "" || this.selectedOrderId === undefined || this.selectedOrderId === null){
      return;
    }
    // await firebase.firestore().collection("p2p-orders").doc(this.selectedOrderId).update({
    //   "": false,
    //   "updated"
    // })
    this.http.get(`https://us-central1-cryptopeer2peer.cloudfunctions.net/changeorderstatus?value=false&order_id=${this.selectedOrderId}&id=${this.selectedOrderId}`).subscribe((res: any) => {
      if (res["error"]) {
        return;
      }
    });
  }

  ngOnInit(): void {
    // this.layout_mode = LAYOUT_MODE
    // if (this.layout_mode === 'dark') {
    //   document.body.setAttribute("data-layout-mode", "dark");
    // }
    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'P2p' },
      { label: '', active: true }
    ];

    this.getAllOrders("buy");
    if(!this.isDashboard) {
      console.log("dashboard");
      this.getBalances();
    }
  }

  listed_as = "BUY";
  order_asset = "USDT";
  showSpinner = true;
  filteredAmount = "";

  button_pressed = false;

  buy_parameter_ngn = "";
  buy_parameter_token = "";

  sell_parameter_ngn = "";
  sell_parameter_token = "";

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

  async getAllOrders(listedAs: string) {
    const uid = this.authService.getLocalStorageUserData().uid;
    firebase.firestore().collection("p2p-orders").where("is_user_ordering", "==", false).where("status", "==", "approved").where("listed_as", "==", listedAs).where("created_by.user_id", "!=", uid).orderBy("created_by.user_id", "desc").onSnapshot(query => {
      this.showSpinner = false;
      if (query.empty) {
        this.tableData = [];
        this.tables$ = of([]);
        this.total$ = of(0);
        return;
      }
      console.log(query.size);
      this.tableData = [];
      query.docs.forEach(doc => {
        const p2p = <P2P>doc.data();
        this.tableData.push(p2p);
      });
      this.reservedTableData = this.tableData;
      this.tables$ = of(this.tableData);
      this.total$ = of(query.size);
    });
  }

  toggleOrderType(orderType: string) {
    this.listed_as = orderType;
    this.getAllOrders(orderType.toLowerCase());
  }

  searchByAmount() {
    if (this.filteredAmount === "" || this.filteredAmount === null) {
      this.tableData = this.reservedTableData;
      this.tables$ = of(this.tableData);
      this.total$ = of(this.tableData.length);
      return;
    }
    const result = this.reservedTableData.filter((val, ind, arr) => {
      if (this.listed_as === "BUY") {
        return (Number(this.filteredAmount) >= (val.order_price * val.order_limit_min)) && (Number(this.filteredAmount) <= (val.order_price * val.order_limit_max));
      } else {
        return (Number(this.filteredAmount) >= val.order_limit_min) && (Number(this.filteredAmount) <= val.order_limit_max);
      }
    });
    this.tableData = result;
    this.tables$ = of(this.tableData);
    this.total$ = of(result.length);
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  openOrderWindow(orderId: string) {
    this.selectedOrderId = orderId;
    this.selectedP2P = this.tableData.find((val, ind, arr) => {
      return val.id === orderId;
    });
    this.openModal();
    this.http.get(`https://us-central1-cryptopeer2peer.cloudfunctions.net/changeorderstatus?value=true&order_id=${orderId}&id=${orderId}`).subscribe((res: any) => {
      if (res["error"]) {
        return;
      }
    });
  }

  onBuyParameterNgnChange(evt: any) {
    this.buy_parameter_token = (Number(this.buy_parameter_ngn) / this.selectedP2P.order_price).toString(); //.fixed
  }

  convertTokenToNGN(value: any) {
    return (value * this.selectedP2P.order_price).toFixed(2)
  }

  setMaxBuy() {
    this.buy_parameter_ngn = this.convertTokenToNGN(this.selectedP2P.order_limit_max);
    this.buy_parameter_token = (Number(this.buy_parameter_ngn) / this.selectedP2P.order_price).toString(); //.fixed
  }

  async submitBuyToken() {
    if (Number(this.buy_parameter_token) < this.selectedP2P.order_limit_min || this.buy_parameter_ngn < this.convertTokenToNGN(this.selectedP2P.order_limit_min)) {
      this.toastr.error(`Amount is below limit of ${this.selectedP2P.order_limit_min} ${this.selectedP2P.order_asset.toUpperCase()}`);
      return;
    }

    if (Number(this.buy_parameter_token) > this.selectedP2P.order_limit_max || this.buy_parameter_ngn > this.convertTokenToNGN(this.selectedP2P.order_limit_max)) {
      this.toastr.error(`Amount is above limit of ${this.selectedP2P.order_limit_max} ${this.selectedP2P.order_asset.toUpperCase()}`);
      return;
    }

    if (this.total_ngn_bal < Number(this.buy_parameter_ngn)) {
      this.toastr.error(`Your NGN account balance is insufficient to perform this trade.`);
      return;
    }

    try{
    this.button_pressed = true;

    const key = firebase.firestore().collection("trades").doc().id;
    const buy_trading_data = {
      id: key,
      send_creator: {
        uid: this.selectedP2P.created_by.user_id,
        currency: "NGN",
        local: true,
        amount: Number(this.buy_parameter_ngn),
      },
      send_guest: {
        uid: this.authService.getLocalStorageUserData().uid,
        currency: this.order_asset,
        local: false,
        amount: Number(this.buy_parameter_token),
      },
      price: this.selectedP2P.order_price,
      p2p_id: this.selectedOrderId,
      listed_as: this.listed_as.toLowerCase(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }
    await firebase.firestore().collection("trades").doc(key).set(buy_trading_data);
    this.toastr.success("Trade successful.");
    this.button_pressed = false;
    this.modalService.dismissAll();
    this.buy_parameter_ngn = "";
    this.buy_parameter_token = "";
    this.selectedOrderId = "";
    this.selectedP2P = null;
  }catch(err) {
    this.button_pressed = false;
    this.toastr.error("An error occurred. Please try again.")
  }
  }

  setMaxSell() {
    this.sell_parameter_token = `${this.total_usdt_bal}`;
    this.sell_parameter_ngn = (Number(this.sell_parameter_token) * this.selectedP2P.order_price).toFixed(2);
  }

  onSellParameterUSDTChange(evt:any) {
    this.sell_parameter_ngn = (Number(this.sell_parameter_token) * this.selectedP2P.order_price).toFixed(2);
  }

  async submitSellToken() {
    if(Number(this.sell_parameter_token) > this.total_usdt_bal) {
      this.toastr.error(`Your USDT account balance is insufficient to perform this trade.`);
      return;
    }

    if(Number(this.sell_parameter_ngn) < this.selectedP2P.order_limit_min) { //Number(this.sell_parameter_ngn) < (this.selectedP2P.order_limit_min * this.selectedP2P.order_price)
      this.toastr.error(`Amount is below limit of ${this.config.getFormattedAmount("NGN", this.selectedP2P.order_limit_min)}`); // ${this.selectedP2P.order_asset.toUpperCase()}`);
      return;
    }

    if(Number(this.sell_parameter_ngn) > this.selectedP2P.order_limit_max) { // Number(this.sell_parameter_ngn) > (this.selectedP2P.order_limit_max * this.selectedP2P.order_price)
      this.toastr.error(`Amount is above limit of ${this.config.getFormattedAmount("NGN", this.selectedP2P.order_limit_max)}`);
      return;
    }

    try {
      this.button_pressed = true;

      const key = firebase.firestore().collection("trades").doc().id;
      const sell_trading_data = {
        id: key,
        send_creator: {
          uid: this.selectedP2P.created_by.user_id,
          currency: this.order_asset,
          local: false,
          amount: Number(this.sell_parameter_token),
        },
        send_guest: {
          uid: this.authService.getLocalStorageUserData().uid,
          currency: "NGN",
          local: true,
          amount: Number(this.sell_parameter_ngn),
        },
        p2p_id: this.selectedOrderId,
        price: this.selectedP2P.order_price,
        listed_as: this.listed_as.toLowerCase(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }
      await firebase.firestore().collection("trades").doc(key).set(sell_trading_data);
      this.toastr.success("Trade successful.");
      this.button_pressed = false;
      this.modalService.dismissAll();
      this.sell_parameter_ngn = "";
      this.sell_parameter_token = "";
      this.selectedOrderId = "";
      this.selectedP2P = null;
    }catch(err) {
      this.button_pressed = false;
      this.toastr.error("An error occurred. Please try again.")
    }
  }

  openModal() {
    if (this.listed_as === "BUY") {
      this.modalService.open(this.buyContent, { centered: true, backdrop: "static" });
    } else {
      this.modalService.open(this.sellContent, { centered: true, backdrop: "static" });
    }
  }

  closeModal() {
    this.modalService.dismissAll();
    this.buy_parameter_ngn = "";
    this.buy_parameter_token = "";
    this.http.get(`https://us-central1-cryptopeer2peer.cloudfunctions.net/changeorderstatus?value=false&order_id=${this.selectedOrderId}&id=${this.selectedOrderId}`).subscribe((res: any) => {
      if (res["error"]) {
        return;
      }
    });
  }

}
