import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';
import firebase from 'firebase/app';
import "firebase/firestore";
import { AdvancedService } from 'src/app/core/tables/table.service';
import { AdvancedSortableDirective } from 'src/app/core/tables/table.sortable.directive';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class OrderHistoryComponent implements OnInit {

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

  constructor(public service: AdvancedService, private authService: AuthenticationService) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'P2p' },
      { label: 'P2P Order History', active: true }
    ];
    this.getOrderHistory();
  }

  async getOrderHistory() {
    const uid = this.authService.getLocalStorageUserData().uid;
    const query = await firebase.firestore().collection("p2p-transactions").where("created_by.user_id", "==", uid).orderBy("timestamp", "desc").get();
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
