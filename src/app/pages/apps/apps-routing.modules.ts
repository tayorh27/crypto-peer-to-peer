import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { InboxComponent } from './inbox/inbox.component';
import { EmailreadComponent } from './emailread/emailread.component';

const routes: Routes = [
    {
        path: 'calender',
        component: CalendarComponent
    },
    {
        path: 'chat',
        component: ChatComponent
    },
    {
        path: 'inbox',
        component: InboxComponent
    },
    {
        path: 'read/:id',
        component: EmailreadComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppsRoutingModule { }