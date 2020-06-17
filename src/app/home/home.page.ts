import { Component, ChangeDetectorRef } from "@angular/core";
import {
  InAppPurchase2,
  IAPProduct,
} from "@ionic-native/in-app-purchase-2/ngx";
import { Platform, AlertController } from "@ionic/angular";

const PRODUCT_GEMS_KEY = "devgems100";
const PRODUCT_PRO_KEY = "devpro";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  gems = 0;
  isPro = false;
  products: IAPProduct[] = [];
  constructor(
    private plt: Platform,
    private alertController: AlertController,
    private store: InAppPurchase2,
    private ref: ChangeDetectorRef
  ) {
    this.plt.ready().then(() => {
      this.store.verbosity = this.store.DEBUG;

      this.registerProducts();
      this.setupListeners();
    });
  }

  registerProducts() {
    this.store.register({
      id: PRODUCT_GEMS_KEY,
      type: this.store.CONSUMABLE,
    });

    this.store.register({
      id: PRODUCT_PRO_KEY,
      type: this.store.NON_CONSUMABLE,
    });

    this.store.refresh();
  }

  setupListeners() {
    this.store.when("product").approved((p: IAPProduct) => {
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
      buttons: ["OK"],
    });

    await alert.present();
  }
}
