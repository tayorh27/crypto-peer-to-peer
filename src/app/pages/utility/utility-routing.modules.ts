import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StarterComponent } from './starter/starter.component';
import { ProfileComponent } from './profile/profile.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { TimelineComponent } from './timeline/timeline.component';
import { PricingComponent } from './pricing/pricing.component';

const routes: Routes = [
    {
        path: 'starter',
        component: StarterComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'invoice',
        component: InvoiceComponent
    },
    {
        path: 'timeline',
        component: TimelineComponent
    },
    {
        path: 'pricing',
        component: PricingComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UtilityRoutingModule { }