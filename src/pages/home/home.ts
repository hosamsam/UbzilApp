import { ServicesProvider } from './../../providers/services/services';
import {AppUtilFunctions} from '../../app/appglobal/app.utilfuns';
// Main Components
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams,} from 'ionic-angular';

import { EServicesCat } from '../../app/appglobal/app.enums';
import { IHomeServices, IHomeServiceResponse } from '../../app/appglobal/app.interfaces';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  nearByServices: any[];
  bookDate: any[];
  requestServices: any[];
  segment: string = "nearbyServices";
  name: any;
  type: any;
  ubzilLoader: boolean = true;



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public services: ServicesProvider,
              public appUtils: AppUtilFunctions) {
              

  }

  async ionViewDidEnter() {
    // Run After Page Already Entered

    let currentLang:string = await this.appUtils.CurrentLang;

    console.log('%s%c%s', 'The Language you are using now is ', 'color: red;font-weight:bold', currentLang);

  }

  ionViewDidLoad() {
    this.services.getDefaultServices({
      user_id: 2,
      verifycode: '$2y$12$FCtEqMB9xLO4FZxj0KUeyuzOwMB/ojRxD9olFk2ReBq5oBtpGO70K',
      lang_code: this.appUtils.CurrentLang
    }).subscribe((homeRes: IHomeServiceResponse) => {
      console.log('main services response',homeRes);

      if (homeRes.status === 'success') {
        //{ this.bookDate, this.nearByServices, this.requestServices } = homeRes.data;

        this.bookDate = homeRes.data.bookDate;
        this.requestServices = homeRes.data.serviceRequest;
        this.nearByServices = homeRes.data.nearByServices;

        console.log(this.bookDate, this.requestServices, this.nearByServices);

      } else {
        console.warn('somthing went wrong when getting services')
      }

      
      
      }, err => {
        this.ubzilLoader = false;
        if (err.error instanceof Error) {
          console.warn('client side error', err);
        } else {
          console.warn('server side error', err);
        }
      }, () => {
        this.ubzilLoader = false;
      }
      
    )
    
    console.log('%s%c%s', 'component class name we are using now ', 'color: green;font-weight:bold', this.navCtrl.getActive().id);

    console.log(`You are ${this.appUtils.IsConnected?'':'not'} connected to the internet`)

  }

  navigateTo(page, pageData?:any) {
    this.navCtrl.push(page, {pageData})
  }





  goSubCategory(type) {
    this.navCtrl.push('SubCategory', { type: type });
    console.log(type);

    console.log('Active View Controller is', this.navCtrl.getActive());
  }

  goSearchResults() {
    this.navCtrl.push('SearchResults');
  }
}
