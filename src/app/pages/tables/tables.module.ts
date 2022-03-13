import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdvancedSortableDirective } from './datatable/sortable.directive';

import { SharedModule } from '../../shared/shared.module';
import { TablesRoutingModule } from './tables-routing.modules';
import { BasicComponent } from './basic/basic.component';
import { DatatableComponent } from './datatable/datatable.component';


@NgModule({
  declarations: [
    BasicComponent,
    DatatableComponent,
    AdvancedSortableDirective
  ],
  imports: [
    CommonModule,
    SharedModule,
    TablesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,

  ]
})
export class TablesModule { }
