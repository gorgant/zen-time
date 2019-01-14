import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('user', featureReducer),
    EffectsModule.forFeature([UserStoreEffects])
  ],
  providers: [UserStoreEffects]
})
export class UserStoreModule { }
