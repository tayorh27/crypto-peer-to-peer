import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountToModule } from 'angular-count-to';
import { ClipboardModule } from "@angular/cdk/clipboard";

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDropdownModule, NgbAccordionModule, NgbNavModule, NgbProgressbarModule, NgbTooltipModule, NgbPopoverModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlutterwaveModule } from "flutterwave-angular-v3";
import { WidgetModule } from '../../shared/widget/widget.module';
import { SharedModule } from '../../shared/shared.module';

import { Select2Module } from "ng-select2-component";
import { HttpClientModule } from "@angular/common/http";

import { QRCodeModule } from 'angularx-qrcode';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TokensRoutingModule } from './tokens.routing.module';
import { TokensComponent } from './tokens.component';
import { TokenTransactionsComponent } from './token-transactions/token-transactions.component';

@NgModule({
  declarations: [
    TokensComponent,
    TokenTransactionsComponent
  ],
  imports: [
    TokensRoutingModule,
    QRCodeModule,
    CommonModule,
    ClipboardModule,
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
  exports: []
})
export class TokensModule { }
