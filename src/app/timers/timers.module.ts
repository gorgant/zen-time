import { NgModule } from '@angular/core';

import { TimersRoutingModule } from './timers-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TimersComponent } from './containers/timers/timers.component';
import { TimerCardListComponent } from './components/timer-card-list/timer-card-list.component';
import { TimerCardItemComponent } from './components/timer-card-item/timer-card-item.component';
import { TimerDetailsComponent } from './components/timer-details/timer-details.component';
import { TimerComponent } from './containers/timer/timer.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { TimerFormDialogueComponent } from './components/timer-form-dialogue/timer-form-dialogue.component';
import { DeleteConfirmDialogueComponent } from './components/delete-confirm-dialogue/delete-confirm-dialogue.component';

@NgModule({
  declarations: [
    TimersComponent,
    TimerCardListComponent,
    TimerCardItemComponent,
    TimerDetailsComponent,
    TimerComponent,
    CountdownComponent,
    TimerFormDialogueComponent,
    DeleteConfirmDialogueComponent
  ],
  imports: [
    SharedModule,
    TimersRoutingModule
  ],
  entryComponents: [
    TimerFormDialogueComponent,
    DeleteConfirmDialogueComponent
  ],
})
export class TimersModule { }
