import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { RequestsGComponent } from './requests-g/requests-g.component';
import { MessagesGComponent } from './messages-g/messages-g.component';
import { SearchGComponent } from './search-g/search-g.component';
import { CreateGroupComponent } from './create-group/create-group.component';


@NgModule({
  declarations: [
    RequestsGComponent,
    MessagesGComponent,
    SearchGComponent,
    CreateGroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  exports: [
    RequestsGComponent,
    MessagesGComponent,
    SearchGComponent
  ]
})
export class GroupSwiperModule { }
