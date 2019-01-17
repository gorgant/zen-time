import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { UndoStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('undo', featureReducer),
    EffectsModule.forFeature([UndoStoreEffects])
  ],
  providers: [UndoStoreEffects]
})
export class UndoStoreModule { }
