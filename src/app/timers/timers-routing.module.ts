import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActiveTimersComponent } from './containers/active-timers/active-timers.component';
import { ActiveTimerComponent } from './containers/active-timer/active-timer.component';
import { DoneTimersComponent } from './containers/done-timers/done-timers.component';
import { DoneTimerComponent } from './containers/done-timer/done-timer.component';

const routes: Routes = [
  {path: 'active', component: ActiveTimersComponent},
  {path: 'active/:id', component: ActiveTimerComponent},
  {path: 'completed', component: DoneTimersComponent},
  {path: 'completed/:id', component: DoneTimerComponent},
  {
    path: '',
    redirectTo: 'active',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimersRoutingModule { }
