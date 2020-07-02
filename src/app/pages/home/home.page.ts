import {
  InAppPurchase2,
  IAPProduct
} from '@ionic-native/in-app-purchase-2/ngx';
import { CalendarComponent } from 'ionic2-calendar';
import {
  Component,
  ViewChild,
  OnInit,
  Inject,
  LOCALE_ID,
  ChangeDetectorRef
} from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { CalModalPage } from '../cal-modal/cal-modal.page';

const PRODUCT_GEMS_KEY = 'devgems100';
const PRODUCT_PRO_KEY = 'devpro';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  eventSource = [];
  viewTitle: string;

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  gems = 0;
  isPro = false;
  products: IAPProduct[] = [];
  constructor(
    private plt: Platform,
    private alertController: AlertController,
    private store: InAppPurchase2,
    private ref: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string,
    private modalCtrl: ModalController
  ) {
    this.plt.ready().then(() => {
      this.store.verbosity = this.store.DEBUG;

      this.registerProducts();
      this.setupListeners();
    });
  }

  ngOnInit() {}

  // Change current month/week/day
  next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
  }

  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertController.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  createRandomEvents() {
    var events = [];
    for (var i = 0; i < 50; i += 1) {
      var date = new Date();
      var eventType = Math.floor(Math.random() * 2);
      var startDay = Math.floor(Math.random() * 90) - 45;
      var endDay = Math.floor(Math.random() * 2) + startDay;
      var startTime;
      var endTime;
      if (eventType === 0) {
        startTime = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + startDay
          )
        );
        if (endDay === startDay) {
          endDay += 1;
        }
        endTime = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + endDay
          )
        );
        events.push({
          title: 'All Day - ' + i,
          startTime: startTime,
          endTime: endTime,
          allDay: true
        });
      } else {
        var startMinute = Math.floor(Math.random() * 24 * 60);
        var endMinute = Math.floor(Math.random() * 180) + startMinute;
        startTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + startDay,
          0,
          date.getMinutes() + startMinute
        );
        endTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + endDay,
          0,
          date.getMinutes() + endMinute
        );
        events.push({
          title: 'Event - ' + i,
          startTime: startTime,
          endTime: endTime,
          allDay: false
        });
      }
    }
    this.eventSource = events;
  }

  removeEvents() {
    this.eventSource = [];
  }

  registerProducts() {
    this.store.register({
      id: PRODUCT_GEMS_KEY,
      type: this.store.CONSUMABLE
    });

    this.store.register({
      id: PRODUCT_PRO_KEY,
      type: this.store.NON_CONSUMABLE
    });

    this.store.refresh();
  }

  setupListeners() {
    this.store.when('product').approved((p: IAPProduct) => {
      if (p.id === PRODUCT_PRO_KEY) {
        this.isPro = true;
      } else if (p.id === PRODUCT_GEMS_KEY) {
        this.gems += 100;
      }
      this.ref.detectChanges();
    });
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
