import { TranslateModule } from 'ng2-translate/ng2-translate';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesDetail } from './messages-detail';

@NgModule({
  declarations: [
    MessagesDetail,
  ],
  imports: [
    IonicPageModule.forChild(MessagesDetail),
    TranslateModule
  ],
  exports: [
    MessagesDetail
  ]
})
export class SettingsModule {}
