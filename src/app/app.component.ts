import {Component, ViewChild} from '@angular/core';
import { Events, Nav, Platform, Config } from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from 'ng2-translate';


//import {Tabs} from '../pages/tabs/tabs';
// import { HomePage } from '../pages/home/home';
// import { ListPage } from '../pages/list/list';
// import { Intro } from '../pages/intro/intro';
//import {Login} from '../pages/login/login';
// import { Signup } from '../pages/signup/signup';
// import { Routes } from '../pages/routes/routes';
// import { RoutesNew } from '../pages/routes-new/routes-new';
// import { RoutesEdit } from '../pages/routes-edit/routes-edit';
// import { Settings } from '../pages/settings/settings';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = 'Tabs';
    textDir: any;
    language: any;
    userLogin: any = false;
    loader: any;
    Token: any;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public translate: TranslateService,
        public events: Events,
        public config: Config

    ) {

        this.initializeApp()
    }

    initializeApp() {
        this.platform.ready().then(() => {

            this.statusBar.styleDefault();
            this.splashScreen.hide();


            this.translate.setDefaultLang('ar');
            this.translate.use('ar');
            this.platform.setDir('rtl', true);
            this.config.set('backButtonIcon', 'ios-arrow-forward') //'ios-arrow-back'
            
            //this.textDir = 'rtl';
        });

        // this language will be used as a fallback when a translation isn't found in the current language
        /*this.app.viewDidLoad
          .subscribe(d=>{
            console.log('component class name you are using is', this.nav.getActive().component.name)
          });*/
        this.events.subscribe('lang:Changed', (lang) => {
            if (lang == 'ar') {
                this.textDir = 'rtl';
                this.language = 'arabic';
                this.platform.setDir('rtl', true);
                this.config.set('backButtonIcon', 'ios-arrow-forward');

                console.log('config change detector', this.config.get('backButtonIcon'))

            } else {
                this.textDir = 'ltr';
                this.language = 'english';
                this.platform.setDir('ltr', true);
                this.config.set('backButtonIcon', 'ios-arrow-back');
                console.log('config change detector', this.config.get('backButtonIcon'))
                
            }
            // Change Global Lang to Selected one
            this.translate.use(lang);
        });


        this.events.subscribe('changeConfig', (key, value) => {
            this.config.set(key, value);
            console.log('config value \"'+key+'\" is ',this.config.get(key))
        })
    }




}
