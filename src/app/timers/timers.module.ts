import { NgModule } from '@angular/core';

import { TimersRoutingModule } from './timers-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ActiveTimersComponent } from './containers/active-timers/active-timers.component';
import { TimerCardListComponent } from './components/timer-card-list/timer-card-list.component';
import { TimerCardItemComponent } from './components/timer-card-item/timer-card-item.component';
import { TimerDetailsComponent } from './components/timer-details/timer-details.component';
import { ActiveTimerComponent } from './containers/active-timer/active-timer.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { TimerFormDialogueComponent } from './components/timer-form-dialogue/timer-form-dialogue.component';
import { DeleteConfirmDialogueComponent } from './components/delete-confirm-dialogue/delete-confirm-dialogue.component';
import { DoneTimersComponent } from './containers/done-timers/done-timers.component';
import { DoneTimerComponent } from './containers/done-timer/done-timer.component';
import { TimerFilterPipe } from './pipes/timer-filter.pipe';
import { SetReminderDialogueComponent } from './components/set-reminder-dialogue/set-reminder-dialogue.component';

@NgModule({
  declarations: [
    ActiveTimersComponent,
    TimerCardListComponent,
    TimerCardItemComponent,
    TimerDetailsComponent,
    ActiveTimerComponent,
    CountdownComponent,
    TimerFormDialogueComponent,
    DeleteConfirmDialogueComponent,
    DoneTimersComponent,
    DoneTimerComponent,
    TimerFilterPipe,
    SetReminderDialogueComponent
  ],
  imports: [
    SharedModule,
    TimersRoutingModule
  ],
  entryComponents: [
    TimerFormDialogueComponent,
    DeleteConfirmDialogueComponent,
    SetReminderDialogueComponent
  ],
})
export class TimersModule { }
