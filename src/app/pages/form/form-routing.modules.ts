import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ElementsComponent } from './elements/elements.component';
import { AdvancedformComponent } from './advancedform/advancedform.component';

const routes: Routes = [
  {
    path: 'elements',
    component: ElementsComponent,
  },
  {
    path: 'advanced',
    component: AdvancedformComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRoutingModule { }
