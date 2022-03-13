import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from "ng-select2-component";
import { ColorPickerModule } from 'ngx-color-picker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { FlatpickrModule } from 'angularx-flatpickr';

import { SharedModule } from '../../shared/shared.module';

import { FormRoutingModule } from './form-routing.modules';
import { ElementsComponent } from './elements/elements.component';
import { AdvancedformComponent } from './advancedform/advancedform.component';

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

@NgModule({
  declarations: [
    ElementsComponent,
    AdvancedformComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbModule,
    Select2Module,
    ColorPickerModule,
    CKEditorModule,
    NgxDropzoneModule,
    FlatpickrModule.forRoot(),
    NgWizardModule.forRoot(ngWizardConfig)
  ]
})
export class FormModule { }
