import { NgModule } from '@angular/core';

import { TimersRoutingModule } from './timers-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TimersComponent } from './containers/timers/timers.component';
import { TimerCardListComponent } from './components/timer-card-list/timer-card-list.component';
import { TimerCardItemComponent } from './components/timer-card-item/timer-card-item.component';

@NgModule({
  declarations: [
    TimersComponent,
    TimerCardListComponent,
    TimerCardItemComponent
  ],
  imports: [
    SharedModule,
    TimersRoutingModule
  ]
})
export class TimersModule { }
