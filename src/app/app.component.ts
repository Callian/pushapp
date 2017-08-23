import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';


import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AlertController } from "ionic-angular";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private push: Push, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.initPushNotification();
    });
  }

  initPushNotification() {
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We don\'t have permission to send push notifications');
        }
      });

    // to initialize push notifications
    const options: PushOptions = {
      android: {
        senderID: 'XXXXXXX'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification);
      //Notification Display Section
      let confirmAlert = this.alertCtrl.create({
        title: 'New Notification',
        message: JSON.stringify(notification),
        buttons: [{
          text: 'Ignore',
          role: 'cancel'
        }, {
          text: 'View',
          handler: () => {
            //TODO: Your logic here
            //self.nav.push(DetailsPage, {message: data.message});
          }
        }]
      });
      confirmAlert.present();
      //
    });
    pushObject.on('registration').
      subscribe((registration: any) =>
        console.log('Device registered', registration));
    pushObject.on('error').
      subscribe(error =>
        console.error('Error with Push plugin', error));
  }
}
