import { NgModule, LOCALE_ID } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HomePage } from "./home.page";

import { HomePageRoutingModule } from "./home-routing.module";

import { NgCalendarModule } from "ionic2-calendar";
import { CalModalPageModule } from "../cal-modal/cal-modal.module";

import { registerLocaleData } from "@angular/common";
import localeJa from "@angular/common/locales/ja";
registerLocaleData(localeJa);
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgCalendarModule,
    CalModalPageModule,
  ],
  declarations: [HomePage],
  providers: [{ provide: LOCALE_ID, useValue: "ja-JA" }],
})
export class HomePageModule {}
