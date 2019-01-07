import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimersComponent } from './containers/timers/timers.component';

const routes: Routes = [
  {path: '', component: TimersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimersRoutingModule { }
