import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Marker,
  GoogleMapsEvent,
  Environment
} from '@ionic-native/google-maps';
import { Geolocation } from "@ionic-native/geolocation";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  map: GoogleMap;
 latitude: number;
  longitude: number;
locationList: any[] = [];


  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public geoLocation: Geolocation) {}

  ionViewDidLoad() {
    this.getLocation();
  }

  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.latitude,
          lng: this.longitude
        },
        zoom: 18,
        tilt: 30
      }
    };


    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'Location',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: this.latitude,
        lng: this.longitude
      }
    });

    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });

    this.updateLocation();
  }

  showToast(value) {
    let toast = this.toastCtrl.create({
      message: value,
      duration: 3000,
      position: "top"
    });

    toast.present();
  }


  getLocation() {

    //this.geoLocation.watchPosition().toPromise

    this.geoLocation.getCurrentPosition().then(response => {
      this.latitude = response.coords.latitude;
      this.longitude = response.coords.longitude;
      this.loadMap();
    }).catch(error => {
      this.showToast(error);
    });

  }

  updateLocation(){

    let watch  = this.geoLocation.watchPosition();
    watch.subscribe( data => {
      let lat = data.coords.latitude;
      let longi = data.coords.longitude;
      var updateLocation = {lat: lat,lng: longi};
      var currentlocation = {lat: this.latitude,lng: this.longitude};


    var locations = [
      updateLocation,currentlocation
    ]

    this.map.clear();

    this.map.addPolyline({
      points: locations,
      color: "#AA00FF",
      width: 10
    });

    });
  }



}
