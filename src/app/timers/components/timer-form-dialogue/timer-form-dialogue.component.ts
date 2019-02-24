import { Component, OnInit, Inject } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timerFormValidationMessages } from 'src/app/shared/models/validation-messages.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Countdown } from 'src/app/shared/models/countdown.model';
import { CountDownClock } from 'src/app/shared/models/count-down-clock.model';
import { durationValidator } from '../../validators/duration-validator.directive';
import { Store } from '@ngrx/store';
import { RootStoreState, TimerStoreActions, UserStoreSelectors } from 'src/app/root-store';
import { TimerService } from '../../services/timer.service';
import { now } from 'moment';
import { EditTimerType } from '../../models/edit-timer-type.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-timer-form',
  templateUrl: './timer-form-dialogue.component.html',
  styleUrls: ['./timer-form-dialogue.component.scss']
})

export class TimerFormDialogueComponent implements OnInit {

  timerForm: FormGroup;
  newTimer: boolean;
  duplicateTimer: boolean;
  timerType: EditTimerType;
  TIMER_FORM_VALIDATION_MESSAGES = timerFormValidationMessages;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TimerFormDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private timer: Timer,
    private store$: Store<RootStoreState.State>,
    private timerService: TimerService,
  ) { }

  ngOnInit() {

    if (this.timer) {
      if (!this.timer.completedDate) {
        this.timerType = EditTimerType.EXISTING_TIMER;
        console.log('Timer identified as', this.timerType);
      } else {
        this.timerType = EditTimerType.DUPLICATE_TIMER;
        console.log('Timer identified as', this.timerType);
      }
    } else {
      this.timerType = EditTimerType.NEW_TIMER;
      console.log('Timer identified as', this.timerType);
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

    if (this.timerType === EditTimerType.EXISTING_TIMER) {
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

    if (this.timerType === EditTimerType.DUPLICATE_TIMER) {
      this.timerForm.patchValue({
        title: this.timer.title,
        category: this.timer.category,
        notes: this.timer.notes,
      });
    }
  }


  onSave() {
    let weeks: number = this.weeks.value;
    let days: number = this.days.value;
    let hours: number = this.hours.value;
    let minutes: number = this.minutes.value;
    weeks = weeks * 1000 * 60 * 60 * 24 * 7;
    days = days * 1000 * 60 * 60 * 24;
    hours = hours * 1000 * 60 * 60;
    minutes = minutes * 1000 * 60;
    const totalDuration: number = minutes + hours + days + weeks;

    const dueDate: number = now() + totalDuration;

    const timerData: Timer = {
      title: this.title.value,
      category: this.category.value,
      notes: this.notes.value,
      duration: totalDuration,
      setOnDate: now(),
      dueDate: dueDate
    };

    this.store$.select(UserStoreSelectors.selectAppUser)
      .pipe(take(1))
      .subscribe(appUser => {
        if (this.timerType === EditTimerType.EXISTING_TIMER) {
          const updatedTimer: Timer = {
            ...timerData,
            id: this.timer.id,
          };
          this.store$.dispatch(new TimerStoreActions.UpdateTimerRequested({userId: appUser.id, timer: updatedTimer}));
          this.dialogRef.close(updatedTimer);
        }

        if (this.timerType === EditTimerType.NEW_TIMER) {
          const autoTimerId: string = this.timerService.generateTimerId();
          const newTimer: Timer = {
            ...timerData,
            id: autoTimerId,
          };
          this.store$.dispatch(new TimerStoreActions.AddTimerRequested({userId: appUser.id, timer: newTimer}));
          this.dialogRef.close(newTimer);
        }

        if (this.timerType === EditTimerType.DUPLICATE_TIMER) {
          const autoTimerId: string = this.timerService.generateTimerId();
          const newTimer: Timer = {
            ...timerData,
            id: autoTimerId,
            completedDate: null
          };
          this.store$.dispatch(new TimerStoreActions.AddTimerRequested({userId: appUser.id, timer: newTimer}));
          this.dialogRef.close(newTimer);
        }
      });
  }

  onClose() {
    this.dialogRef.close(false);
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
