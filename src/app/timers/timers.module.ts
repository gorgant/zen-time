import { NgModule } from '@angular/core';

import { TimersRoutingModule } from './timers-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TimersComponent } from './containers/timers/timers.component';

@NgModule({
  declarations: [
    TimersComponent
  ],
  imports: [
    SharedModule,
    TimersRoutingModule
  ]
})
export class TimersModule { }
