import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RemainingTimePipe } from './pipes/remaining-time.pipe';
import { MatElevationDirective } from './directives/mat-elevation.directive';
import { PushRequestComponent } from './components/push-request/push-request.component';

@NgModule({
  declarations: [
    RemainingTimePipe,
    MatElevationDirective,
    PushRequestComponent,
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
    PushRequestComponent
  ],
})
export class SharedModule { }
