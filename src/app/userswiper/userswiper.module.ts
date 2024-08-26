import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { RequestsComponent } from './requests/requests.component';
import { MessagesComponent } from './messages/messages.component';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    RequestsComponent,
    MessagesComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  exports: [
    RequestsComponent,
    MessagesComponent,
    SearchComponent
  ]
})
export class UserSwiperModule { }
