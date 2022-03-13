import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbAlertModule, NgbCarouselModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { AdvancedRoutingModule } from './advanced-routing.modules';
import { SweetalertComponent } from './sweetalert/sweetalert.component';
import { RangesliderComponent } from './rangeslider/rangeslider.component';
import { NotificationComponent } from './notification/notification.component';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  declarations: [
    SweetalertComponent,
    RangesliderComponent,
    NotificationComponent,
    CarouselComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdvancedRoutingModule,
    Ng5SliderModule,
    NgbToastModule,
    NgbAlertModule,
    NgbCarouselModule
  ]
})
export class AdvancedModule { }
