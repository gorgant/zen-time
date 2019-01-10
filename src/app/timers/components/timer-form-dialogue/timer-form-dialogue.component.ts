import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimerFormValidationMessages } from 'src/app/shared/models/validation-messages.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Countdown } from 'src/app/shared/models/countdown.model';
import { CountDownClock } from 'src/app/shared/models/count-down-clock.model';
import { durationValidator } from '../../validators/duration-validator.directive';

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
  ) { }

  ngOnInit() {

    if (this.timer) {
      this.newTimer = false;
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
    const timerData: Timer = this.timerForm.value;
    if (!this.newTimer) {
      console.log('Save timer updates', timerData);
    } else {
      console.log('Create new timer', timerData);
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

}
