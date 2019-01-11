import { Component, OnInit, Inject } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimerFormValidationMessages } from 'src/app/shared/models/validation-messages.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Countdown } from 'src/app/shared/models/countdown.model';
import { CountDownClock } from 'src/app/shared/models/count-down-clock.model';
import { durationValidator } from '../../validators/duration-validator.directive';
import { Store } from '@ngrx/store';
import { RootStoreState, TimerStoreActions } from 'src/app/root-store';
import { TimerService } from '../../services/timer.service';
import { now } from 'moment';

@Component({
  selector: 'app-timer-form',
  templateUrl: './timer-form-dialogue.component.html',
  styleUrls: ['./timer-form-dialogue.component.scss']
})
export class TimerFormDialogueComponent implements OnInit {

  timerForm: FormGroup;
  newTimer: boolean;
  TIMER_FORM_VALIDATION_MESSAGES = TimerFormValidationMessages;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TimerFormDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private timer: Timer,
    private store$: Store<RootStoreState.State>,
    private timerService: TimerService,
  ) { }

  ngOnInit() {

    if (this.timer) {
      this.newTimer = false;
      console.log('Timer detected, loading timer data');
    } else {
      this.newTimer = true;
      console.log('No timer detected, loading blank form');
    }

    this.timerForm = this.fb.group({
      title: ['', Validators.required],
      category: [''],
      notes: [''],
      duration: this.fb.group({
        weeks: [''],
        days: [''],
        hours: [''],
        minutes: ['']
      }, {validator: durationValidator()})
    });

    if (!this.newTimer) {
      const countDownClock: CountDownClock = new Countdown(this.timer).getCountDownClock();
      this.timerForm.patchValue({
        title: this.timer.title,
        category: this.timer.category,
        notes: this.timer.notes,
        duration: {
          weeks: countDownClock.weeks,
          days: countDownClock.days,
          hours: countDownClock.hours,
          minutes: countDownClock.minutes
        },
      });
    }
  }


  onSave() {
    // const timerFormValues = this.timerForm.value;
    let weeks: number = this.weeks.value;
    let days: number = this.days.value;
    let hours: number = this.hours.value;
    let minutes: number = this.minutes.value;
    weeks = weeks * 1000 * 60 * 60 * 24 * 7;
    days = days * 1000 * 60 * 60 * 24;
    hours = hours * 1000 * 60 * 60;
    minutes = minutes * 1000 * 60;
    const totalDuration: number = minutes + hours + days + weeks;

    const timerData: Timer = {
      title: this.title.value,
      category: this.category.value,
      notes: this.notes.value,
      duration: totalDuration,
      setOnDate: now()
    };

    if (!this.newTimer) {
      const updatedTimer: Timer = {
        ...timerData,
        id: this.timer.id,
      };
      console.log('Dispatching request to update timer');
      this.store$.dispatch(new TimerStoreActions.UpdateTimerRequested({timer: updatedTimer}));
    } else {
      const autoTimerId: string = this.timerService.generateTimerId();
      const newTimer: Timer = {
        ...timerData,
        id: autoTimerId,
      };
      console.log('Dispatching request to create new timer');
      this.store$.dispatch(new TimerStoreActions.AddTimerRequested({timer: newTimer}));
    }
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

  // These getters are used for easy access in the HTML template
  get title() { return this.timerForm.get('title'); }
  get category() { return this.timerForm.get('category'); }
  get notes() { return this.timerForm.get('notes'); }
  get duration() { return this.timerForm.get('duration'); }
  get weeks() { return this.timerForm.get('duration.weeks'); }
  get days() { return this.timerForm.get('duration.days'); }
  get hours() { return this.timerForm.get('duration.hours'); }
  get minutes() { return this.timerForm.get('duration.minutes'); }

}
