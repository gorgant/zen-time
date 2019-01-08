import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimersComponent } from './containers/timers/timers.component';
import { TimerDetailsComponent } from './components/timer-details/timer-details.component';

const routes: Routes = [
  {path: '', component: TimersComponent},
  {path: ':id', component: TimerDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimersRoutingModule { }
