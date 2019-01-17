import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RemainingTimePipe } from './pipes/remaining-time.pipe';
import { MatElevationDirective } from './directives/mat-elevation.directive';

@NgModule({
  declarations: [
    RemainingTimePipe,
    MatElevationDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    RemainingTimePipe,
    MatElevationDirective,
  ],
})
export class SharedModule { }
