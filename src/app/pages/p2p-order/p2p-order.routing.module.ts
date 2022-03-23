import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrderComponent } from './create-order/create-order.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { P2POrderComponent } from './p2p-order.component';

const routes: Routes = [
  {
    path: '',
    component: P2POrderComponent
  },
  {
    path: 'new-order',
    component: CreateOrderComponent
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent
  },
  {
    path: 'my-order/:order_id',
    component: MyOrdersComponent
  },
  {
    path: 'orders/history',
    component: OrderHistoryComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class P2POrderRoutingModule { }