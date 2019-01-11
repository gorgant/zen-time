import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { TimerStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('timers', featureReducer),
    EffectsModule.forFeature([TimerStoreEffects])
  ],
  providers: [TimerStoreEffects]
})
export class TimersStoreModule { }
