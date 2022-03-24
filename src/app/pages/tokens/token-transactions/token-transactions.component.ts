import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/firestore";
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AdvancedService } from 'src/app/core/tables/table.service';
import { AdvancedSortableDirective } from 'src/app/core/tables/table.sortable.directive';

@Component({
  selector: 'app-token-transactions',
  templateUrl: './token-transactions.component.html',
  styleUrls: ['./token-transactions.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class TokenTransactionsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  tableData!: any[];
  reservedTableData!: any[];
  hideme: boolean[] = [];
  tables$: Observable<any[]>;
  total$: Observable<number>;
  @ViewChildren(AdvancedSortableDirective)
  headers!: QueryList<AdvancedSortableDirective>;

  showSpinner = false;

  constructor(public service: AdvancedService, private authService: AuthenticationService, private toastr: ToastrService) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Tokens' },
      { label: 'Transactions', active: true }
    ];
    // this.getTokenTransactions();
  }

  async getTokenTransactions() {
    const uid = this.authService.getLocalStorageUserData().uid;
    const query = await firebase.firestore().collection("token-transactions").where("created_by.user_id", "==", uid).orderBy("timestamp", "desc").get();
    this.showSpinner = false;
    if (query.empty) {
      this.tableData = [];
      this.tables$ = of([]);
      this.total$ = of(0);
      return;
    }
    this.tableData = [];
    query.docs.forEach(doc => {
      const orders = doc.data();
      this.tableData.push(orders);
    });
    this.tables$ = of(this.tableData);
    this.total$ = of(query.size);
  }

}
