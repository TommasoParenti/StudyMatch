import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccessComponent } from './access/access.component';
import { AccessModule } from './access/access.module';
import { UtilityComponentsModule } from './utility-components/utilitycomponents.module';
import { UserswiperComponent } from './userswiper/userswiper.component';
import { UserSwiperModule } from './userswiper/userswiper.module';
import { GroupswiperComponent } from './groupswiper/groupswiper.component';
import { GroupSwiperModule } from './groupswiper/groupswiper.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { firebaseConfig } from '../enviroment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthService } from './_services/authentication.service';
import { DbService } from './_services/db.service';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    AccessComponent,
    UserswiperComponent,
    GroupswiperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccessModule,
    UserSwiperModule,
    GroupSwiperModule,
    UtilityComponentsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    AuthService, 
    DbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
