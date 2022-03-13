import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { LanguageService } from '../core/services/language.service';

import { LayoutComponent } from './layout.component';
import { VerticalComponent } from './vertical/vertical.component';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { FooterComponent } from './footer/footer.component';
import { TopbarComponent } from './topbar/topbar.component';
import { RightsidebarComponent } from './rightsidebar/rightsidebar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HorizontaltopbarComponent } from './horizontaltopbar/horizontaltopbar.component';

@NgModule({
  declarations: [
    LayoutComponent,
    VerticalComponent,
    HorizontalComponent,
    FooterComponent,
    TopbarComponent,
    RightsidebarComponent,
    SidebarComponent,
    HorizontaltopbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    TranslateModule,
    ClickOutsideModule
  ],
  providers: [LanguageService]
})
export class LayoutsModule { }
