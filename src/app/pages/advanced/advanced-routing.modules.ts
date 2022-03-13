import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SweetalertComponent } from './sweetalert/sweetalert.component';
import { RangesliderComponent } from './rangeslider/rangeslider.component';
import { NotificationComponent } from './notification/notification.component';
import { CarouselComponent } from './carousel/carousel.component';

const routes: Routes = [
  {
    path: 'sweet-alert',
    component: SweetalertComponent
  },
  {
    path: 'rangeslider',
    component: RangesliderComponent
  },
  {
    path: 'notifications',
    component: NotificationComponent
  },
  {
    path: 'carousel',
    component: CarouselComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancedRoutingModule { }