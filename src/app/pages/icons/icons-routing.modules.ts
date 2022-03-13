import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoxiconsComponent } from './boxicons/boxicons.component';
import { MaterialdesignComponent } from './materialdesign/materialdesign.component';
import { DripiconsComponent } from './dripicons/dripicons.component';
import { FontawsomeComponent } from './fontawsome/fontawsome.component';

const routes: Routes = [
    {
        path: 'boxicons',
        component: BoxiconsComponent
    },
    {
        path: 'materialdesign',
        component: MaterialdesignComponent
    },
    {
        path: 'dripicons',
        component: DripiconsComponent
    },
    {
        path: 'fontawesome',
        component: FontawsomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IconsRoutingModule { }