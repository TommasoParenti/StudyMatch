import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { SegmentedControlComponent } from './segmented-control/segmented-control.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PersonalProfileComponent } from './personal-profile/personal-profile.component';
import { PersonalProfileModule } from './personal-profile/personal-profile.module';
import { FilterComponent } from './filter/filter.component';
import { CardComponent } from './card/card.component';
import { CardGComponent } from './card-g/card-g.component';


@NgModule({
  declarations: [
    SegmentedControlComponent,
    NavbarComponent,
    PersonalProfileComponent,
    FilterComponent,
    CardComponent,
    CardGComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PersonalProfileModule
  ],
  exports: [
    SegmentedControlComponent,
    NavbarComponent,
    PersonalProfileComponent,
    FilterComponent,
    CardComponent,
    CardGComponent,
  ]
})
export class UtilityComponentsModule { }
