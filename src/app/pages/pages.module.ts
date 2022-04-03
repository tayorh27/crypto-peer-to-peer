import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountToModule } from 'angular-count-to';
import {ClipboardModule} from '@angular/cdk/clipboard';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDropdownModule, NgbAccordionModule, NgbNavModule, NgbProgressbarModule, NgbTooltipModule, NgbPopoverModule, NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

import { UtilityModule } from './utility/utility.module';
import { AdvancedModule } from './advanced/advanced.module';
import { FormModule } from './form/form.module';
import { TablesModule } from './tables/tables.module';
import { IconsModule } from './icons/icons.module';
import { AppsModule } from './apps/apps.module';
import { PagesRoutingModule } from './pages-routing.modules';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { WidgetModule } from '../shared/widget/widget.module';
import { UiComponent } from './ui/ui.component';
import { TypographyComponent } from './typography/typography.component';
import { ChartsComponent } from './charts/charts.component';
import { MapsComponent } from './maps/maps.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlutterwaveModule } from "flutterwave-angular-v3"

import { Select2Module } from "ng-select2-component";
import { HttpClientModule } from "@angular/common/http";
import { P2POrderModule } from './p2p-order/p2p-order.module';
import { FiatTransactionsComponent } from './fiat-transactions/fiat-transactions.component';

import { AdvancedSortableDirective } from 'src/app/core/tables/table.sortable.directive';

@NgModule({
  declarations: [
    DashboardsComponent,
    UiComponent,
    TypographyComponent,
    ChartsComponent,
    MapsComponent,
    FiatTransactionsComponent,
    // AdvancedSortableDirective,
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    WidgetModule,
    PagesRoutingModule,
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
    UtilityModule,
    AdvancedModule,
    FormModule,
    TablesModule,
    IconsModule,
    AppsModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE'
    }),
    FormsModule,
    ReactiveFormsModule,
    FlutterwaveModule,
    Select2Module,
    HttpClientModule,
    P2POrderModule,
    NgbModule
  ]
})
export class PagesModule { }
