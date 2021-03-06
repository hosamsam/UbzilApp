import { TranslateModule } from 'ng2-translate';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddRequest } from './add-request';
import { CheckboxControlValueAccessor } from '@angular/forms';

@NgModule({
  declarations: [
    AddRequest,
  ],
  imports: [
    IonicPageModule.forChild(AddRequest),
    TranslateModule
  ],
  exports: [
    AddRequest
  ]
})
export class IntroModule {}
