import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app-routing.module';
import { CompleteProfile1Component } from './complete-profile-1/complete-profile-1.component';
import { CompleteProfile2Component } from './complete-profile-2/complete-profile-2.component';


@NgModule({
  declarations: [
    CompleteProfile1Component,
    CompleteProfile2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  exports: [
    CompleteProfile1Component,
    CompleteProfile2Component,
  ]
})
export class RegisterModule { }
