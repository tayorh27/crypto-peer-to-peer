import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { AppsRoutingModule } from './apps-routing.modules';
import { NgbNavModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';

import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { InboxComponent } from './inbox/inbox.component';
import { EmailreadComponent } from './emailread/emailread.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { SharedModule } from '../../shared/shared.module';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    CalendarComponent,
    ChatComponent,
    InboxComponent,
    EmailreadComponent
  ],
  imports: [
    CommonModule,
    AppsRoutingModule,
    FullCalendarModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    CKEditorModule,
    SharedModule
  ]
})
export class AppsModule { }
