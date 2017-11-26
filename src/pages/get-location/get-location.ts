import { ServicesProvider } from './../../providers/services/services';
import { Http } from '@angular/http';
import { UserProvider } from './../../providers/user/user';
import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavParams, ViewController, LoadingController, Events } from 'ionic-angular';
import { Geolocation} from '@ionic-native/geolocation';
import {NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";
//import {IlocalUser} from "../../app/appglobal/app.interfaces";
import {AppUtilFunctions} from '../../app/appglobal/app.utilfuns';

declare var google;

@Component({
    selector: 'page-get-location',
    templateUrl: 'get-location.html',
})

export class GetLocation {
    @ViewChild('map') mapElement: ElementRef;
    initMap: any;
    user:string;
    userMap:string;
    userLocal:any;
    modalData: any = {};
    latitude: any;
    mapLoaded: boolean = false;
    longitude: any;
    map: any;
    markers = [];
    loader: any = true;
    comeFrom:any;    

    constructor(
        params:NavParams,
        public viewCtrl:ViewController,
        public geolocation: Geolocation,
        public appUtils: AppUtilFunctions,
        public userProvider: UserProvider,
        public geocoderNative: NativeGeocoder,
        public loadingCtrl: LoadingController,
        public http: Http
    ) {
        console.log('********************** map *********************');        
        this.initMap = params.get('pageData');
        if(this.initMap.comeFrom){
          this.comeFrom = this.initMap.comeFrom;
          console.log(this.comeFrom);
        }
        
        console.log('init NavParams Map',this.initMap);
    }

    ionViewDidLoad() {
        this.userLocal = this.appUtils.storage.get('localUserInfo');        
        if (this.userLocal) {
            this.user = this.appUtils.storage.get('localUserInfo')['username'];
            console.log(this.user);
        }
        
        
        this.getCurrentLoc();
    }

    removeMarkers() {
        this.markers.forEach(map => {
            map.setMap(null);
        });
        this.markers = [];
    }

    getCurrentLoc() {
        
        let geolocate = this.geolocation.getCurrentPosition();
        geolocate.then((res) => {
                console.log('your current locations are \n' + res.coords.latitude + '\n' + res.coords.longitude);
        
                [this.latitude, this.longitude] = [res.coords.latitude, res.coords.longitude];
                console.log('init Map from geolocation resolve', this.initMap);
                (this.initMap.latitude) ? this.loadMap(this.initMap.latitude, this.initMap.longitude) :this.loadMap(this.latitude, this.longitude);
        
            }).catch((err) => {
        
                //alert('no geolocation activated');
                console.warn(err);
                console.log('no location');
                console.log('init Map from geolocation catch', this.initMap);
        
                (this.initMap.latitude) ? this.loadMap(this.initMap.latitude, this.initMap.longitude) : this.getUserDataFormIp();
            });
    }

    loadMap(latitude, longitude) {
        this.setNewLoc(this.modalData, latitude, longitude);
        console.log('load map with latlng', latitude, longitude);
        if (!latitude && !longitude) {
          [latitude, longitude] = [(this.userLocal.latitude) ? this.userLocal.latitude : this.modalData.latitude, (this.userLocal.longitude) ? this.userLocal.longitude : this.modalData.longitude];
        }
        this.getAddress(latitude, longitude); // geocoding the location address
        let latLng = new google.maps.LatLng(latitude, longitude);
    
        let mapOptions = {
          center: latLng,
          zoom: 17,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
    
        };
        this.loader = false;
        //this.loader.dismiss();
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    
    
        let input = document.getElementById('pac-input');
        let searchBox = new google.maps.places.SearchBox(input);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        this.mapLoaded = true;
        this.map.addListener('bounds_changed', function () {
          //searchBox.setBounds(this.map.getBounds());
        });
        this.mapLoaded = true;
        searchBox.addListener('places_changed',  ()=> {
          let places = searchBox.getPlaces();
    
          if (places.length == 0) {
            return;
          }
    
          // Clear out the old markers.
          this.removeMarkers();
    
          // For each place, get the icon, name and location.
          let bounds = new google.maps.LatLngBounds();
          places.forEach( (place)=> {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
    
            // Create a marker for each place.
            /*this.markers.push(new google.maps.Marker({
              map: this.map,
              title: place.name,
              position: place.geometry.location
            }));
            */
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          this.map.fitBounds(bounds);
        });
    
    
        google.maps.event.addListener(this.map,'click', (event) => {
          console.log('loadMap set maker here');
          console.log('loadMap event latLng', event.latLng, event.latLng.lat(), event.latLng.lng());
          this.setNewLoc(this.modalData, event.latLng.lat(), event.latLng.lng());
          this.addMarker(event.latLng);
          this.getAddress(event.latLng.lat(), event.latLng.lng());
          //console.log('new address here ', this.getAddress(event.latLng.lat(), event.latLng.lng()));
        });
    
        this.addMarker();
    
    
    }

    myCurrentLoc() {
        let geoloacte = this.geolocation.getCurrentPosition();
    
    
          geoloacte.then((res)=>{
            let [lat, lng] = [res.coords.latitude, res.coords.longitude];
            console.log('your location is ', lat,lng);
            let loc =  {lat, lng};
            /*this.mapLoaded = false;
            this.loadMap(loc.lat, loc.lng);*/
            let latLng = new google.maps.LatLng(loc.lat, loc.lng);
    
            let mapOptions = {
              center: latLng,
              zoom: 17,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
    
            };
    
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    
            google.maps.event.addListener(this.map,'click', (event) => {
              console.log('myCurrentLoc set maker here');
              console.log('myCurrentLoc event latLng ', event.latLng, event.latLng.lat(), event.latLng.lng());
              this.setNewLoc(this.modalData, event.latLng.lat(), event.latLng.lng());
              this.addMarker(event.latLng);
              this.getAddress(event.latLng.lat(), event.latLng.lng());
            });    
    
            this.addMarker();
    
    
          }).catch((err)=>{
            console.log('The GPS is not activated also');
            console.warn(err);
          })
    }

    loadMapWithoutplaces(latitude, longitude) {
        
        let latLng = new google.maps.LatLng(latitude, longitude);
    
        let mapOptions = {
          center: latLng,
          zoom: 17,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
    
        };
        this.loader = false;
        //this.loader.dismiss();
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    
        this.addMarker();
    
    }
    
    getUserDataFormIp() {
        this.userProvider.getUserIP().flatMap((res: any) => {
          console.log(res);
          return this.userProvider.getUserLocayionInfoByIp(res.ip)
        })
          .subscribe(res => {
            console.log(res);
            this.modalData = {
              latitude: res.loc.split(',')[0],
              longitude: res.loc.split(',')[1],
              ip: res.ip,
              address: res.city + ' ' + res.country
            };
            console.log(this.modalData);
            this.loadMap(this.modalData.latitude, this.modalData.longitude);
    
          });
    }
    

    addMarker(loc?:any) {
        this.removeMarkers();
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: (!loc) ? this.map.getCenter() : loc
        });
        /*if (loc) {
          console.log('new location of the client', loc, loc.lat(), loc.lng());
          this.setNewLoc(this.modalData, loc.lat(), loc.lng());
          this.getAddress(loc.lat(), loc.lng());
        }*/
    
    
        google.maps.event.addListener(marker, 'drag', (event) => {
    
          console.log(event)
        });
        let content = "<h6>"+(this.user)?this.user:'موقعى'+"</h6>";
    
        this.markers.push(marker);
        this.addInfoWindow(marker, content);
    }

    addInfoWindow(marker, content) {
    
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });
    
        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
        });
    
    }

    getAddress(latitude, longitude) {
    
        let geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&key=AIzaSyBL9-cIsQpwffcZ5NCHEuHilTG_7sEhSXg';
        this.http.get(geocodeUrl)
          .map(res=>res.json())
          .pluck('results')
          .subscribe(
            result=>{
            console.log('response from geocoding', result[0].formatted_address);
            this.modalData.address = result[0].formatted_address;
    
          },
            err=> {
            console.warn(err);
            })
    
        /*
        this.geocoderNative.reverseGeocode(latitude, longitude).then((result: NativeGeocoderReverseResult) => {
          let geocodeAddress = result.street + " " + result.houseNumber + ", " + result.postalCode + " " + result.city + " " + result.district + " in " + result.countryName + " - " + result.countryCode;
          console.log("The address is: \n\n" + geocodeAddress);
          this.modalData.address = geocodeAddress;
          console.log(geocodeAddress);
    
        }).then(err=>{
          console.log(err);
        });
    
        this.geocoderNative.forwardGeocode('october').then((result:NativeGeocoderForwardResult)=>{
          console.log(result.latitude, result.longitude);
        }).catch(err=>{
          console.warn(err)
        })*/
    }
    
    setNewLoc(target, latitude, longitude):void {
        target.latitude = latitude;
        target.longitude = longitude;
    }

    closeModal(): void {
        this.loader = false;
        //this.loader.dismiss();
        this.viewCtrl.dismiss( this.modalData )
    }
    
    closeModalwithoutSave() {
          this.loader = false;
      
          //this.loader.dismiss();
          this.viewCtrl.dismiss();
    }
}


