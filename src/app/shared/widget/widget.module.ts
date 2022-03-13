import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { TransactionComponent } from './transaction/transaction.component';
import { OrderComponent } from './order/order.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    TransactionComponent,
    OrderComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    NgbDropdownModule
  ],
  exports: [TransactionComponent, OrderComponent, UserComponent]
})
export class WidgetModule { }
