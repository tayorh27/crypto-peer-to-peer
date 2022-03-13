import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { IconsRoutingModule } from './icons-routing.modules';
import { BoxiconsComponent } from './boxicons/boxicons.component';
import { MaterialdesignComponent } from './materialdesign/materialdesign.component';
import { DripiconsComponent } from './dripicons/dripicons.component';
import { FontawsomeComponent } from './fontawsome/fontawsome.component';


@NgModule({
  declarations: [
    BoxiconsComponent,
    MaterialdesignComponent,
    DripiconsComponent,
    FontawsomeComponent
  ],
  imports: [
    CommonModule,
    IconsRoutingModule,
    SharedModule
  ]
})
export class IconsModule { }
