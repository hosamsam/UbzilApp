import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, ViewController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';

declare var google;
@IonicPage()
@Component({
    selector: 'page-get-location',
    templateUrl: 'get-location.html',
})

export class GetLocation {
    @ViewChild('map') mapElement: ElementRef;
    map: any;

    constructor(
        public navCtrl: NavController,
        public viewCtrl: ViewController,
        public geolocation: Geolocation
    ) {
    }
    ionViewDidLoad() {
        this.loadMap();
    }

    loadMap() {

        this.geolocation.getCurrentPosition().then((position) => {

            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            this.addMarker();

        }, (err) => {
            console.log(err);
        });

    }

    addMarker() {

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });

        let content = "<h4>Information!</h4>";

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

       dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}


