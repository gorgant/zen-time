import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthModule } from './auth/auth.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RootStoreModule } from './root-store';
import { HeaderComponent } from './navigation/components/header/header.component';
import { SidenavComponent } from './navigation/components/sidenav/sidenav.component';
import { AngularFireStorageModule } from '@angular/fire/storage';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AuthModule,
    RootStoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
