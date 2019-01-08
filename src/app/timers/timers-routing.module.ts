import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimersComponent } from './containers/timers/timers.component';
import { TimerComponent } from './containers/timer/timer.component';

const routes: Routes = [
  {path: '', component: TimersComponent},
  {path: ':id', component: TimerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimersRoutingModule { }
