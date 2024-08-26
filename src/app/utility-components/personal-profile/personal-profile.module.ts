import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { QrCodeComponent } from './qr-code/qr-code.component';


@NgModule({
  declarations: [
    ProfileComponent,
    QrCodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  exports: [
    ProfileComponent,
    QrCodeComponent
  ]
})

export class PersonalProfileModule { }
