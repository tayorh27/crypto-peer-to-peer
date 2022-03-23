import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountToModule } from 'angular-count-to';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDropdownModule, NgbAccordionModule, NgbNavModule, NgbProgressbarModule, NgbTooltipModule, NgbPopoverModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlutterwaveModule } from "flutterwave-angular-v3";
import { WidgetModule } from '../../shared/widget/widget.module';
import { SharedModule } from '../../shared/shared.module';

import { Select2Module } from "ng-select2-component";
import { HttpClientModule } from "@angular/common/http";
import { CreateOrderComponent } from './create-order/create-order.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { P2POrderRoutingModule } from './p2p-order.routing.module';
import { P2POrderComponent } from './p2p-order.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdvancedSortableDirective } from 'src/app/core/tables/table.sortable.directive';

@NgModule({
  declarations: [
    CreateOrderComponent,
    MyOrdersComponent,
    OrderHistoryComponent,
    P2POrderComponent,
    AdvancedSortableDirective
  ],
  imports: [
    P2POrderRoutingModule,
    CommonModule,
    ScrollToModule.forRoot(),
    NgApexchartsModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbNavModule,
    NgbProgressbarModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbPopoverModule,
    CountToModule,
    FormsModule,
    ReactiveFormsModule,
    FlutterwaveModule,
    Select2Module,
    HttpClientModule,
    WidgetModule,
    SharedModule,
    NgbModule
  ],
  exports: [P2POrderComponent ]
})
export class P2POrderModule { }
