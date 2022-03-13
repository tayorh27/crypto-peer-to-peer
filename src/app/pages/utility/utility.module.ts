import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbAccordionModule, NgbNavModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';

import { SharedModule } from '../../shared/shared.module';
import { UtilityRoutingModule } from './utility-routing.modules';
import { StarterComponent } from './starter/starter.component';
import { ProfileComponent } from './profile/profile.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { TimelineComponent } from './timeline/timeline.component';
import { PricingComponent } from './pricing/pricing.component';

@NgModule({
  declarations: [
    StarterComponent,
    ProfileComponent,
    InvoiceComponent,
    TimelineComponent,
    PricingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UtilityRoutingModule,
    NgbAccordionModule,
    NgbNavModule,
    NgbDropdownModule,
    SimplebarAngularModule
  ]
})
export class UtilityModule { }
