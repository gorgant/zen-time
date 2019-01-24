import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStoreModule } from './auth-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { CustomSerializer } from '../shared/utils/utils';
import { TimersStoreModule } from './timer-store';
import { metaReducers } from './meta-reducers';
import { DoneStoreModule } from './done-store';
import { UserStoreModule } from './user-store';
import { UndoStoreModule } from './undo-store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthStoreModule,
    TimersStoreModule,
    DoneStoreModule,
    UserStoreModule,
    UndoStoreModule,
    StoreModule.forRoot({}, {metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    // StoreDevtoolsModule.instrument({
    //   maxAge: 25, // Retains last 25 states
    //   logOnly: environment.production, // Restrict extension to log-only mode
    // }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
  ],
})
export class RootStoreModule { }
