import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/firestore";
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AdvancedService } from 'src/app/core/tables/table.service';
import { AdvancedSortableDirective } from 'src/app/core/tables/table.sortable.directive';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class MyOrdersComponent implements OnInit {

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
      { label: 'P2p' },
      { label: 'My P2P Orders', active: true }
    ];
    this.getOrders();
  }

  async getOrders() {
    const uid = this.authService.getLocalStorageUserData().uid;
    const query = await firebase.firestore().collection("p2p-orders").where("created_by.user_id", "==", uid).orderBy("timestamp", "desc").get();
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
    // this.service.setTableData(this.tableData);
    // this.service._search();
    this.tables$ = of(this.tableData);
    this.total$ = of(query.size);
  }

  deleteOrder(orderId: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true,
      })
      .then(async (result) => {
        if (result.value) {
          try {
            await firebase.firestore().collection("p2p-orders").doc(orderId).delete();
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your order has been deleted.',
              'success'
            );
          } catch (err) {
            this.toastr.error("An error occurred. Please try again.");
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your order data is safe :)',
            'error'
          );
        }
      });
  }

}
