import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtrapagesRoutingModule } from './extrapages-routing.module';

import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ComingsoonComponent } from './comingsoon/comingsoon.component';
import { Page500Component } from './page500/page500.component';
import { Page404Component } from './page404/page404.component';

@NgModule({
  declarations: [
    MaintenanceComponent,
    ComingsoonComponent,
    Page500Component,
    Page404Component
  ],
  imports: [
    CommonModule,
    ExtrapagesRoutingModule
  ]
})
export class ExtrapagesModule { }
