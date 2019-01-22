import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Timer } from '../../models/timer.model';
import { Store } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store';
import { TimerService } from '../../services/timer.service';
import { Calendars } from 'src/app/shared/utils/calendar/calendars';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-set-reminder-dialogue',
  templateUrl: './set-reminder-dialogue.component.html',
  styleUrls: ['./set-reminder-dialogue.component.scss']
})
export class SetReminderDialogueComponent implements OnInit {

  reminderUrl: string;
  calendars: Calendars;

  constructor(
    private dialogRef: MatDialogRef<SetReminderDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private timer: Timer,
    private store$: Store<RootStoreState.State>,
    private timerService: TimerService,
  ) { }

  ngOnInit() {
    this.calendars = new Calendars(this.timer);
  }

  onSetGoogleReminder() {
    this.configureReminderUrl('google');
    window.open(this.reminderUrl);
  }

  onSetMicrosoftReminder() {
    this.configureReminderUrl('microsoft');
    window.open(this.reminderUrl);
  }

  onSetYahooReminder() {
    this.configureReminderUrl('yahoo');
    window.open(this.reminderUrl);
  }

  onSetIcsReminder() {
    this.configureReminderUrl('ics');
  }

  private configureReminderUrl(calendarType) {

    switch (calendarType) {
      case 'google': {
        const calUrl: string = this.calendars.getGoogleCalendarUrl();
        this.reminderUrl = calUrl;
        return true;
      }
      case 'microsoft': {
        const calUrl: string = this.calendars.getMicrosoftCalendarUrl();
        this.reminderUrl = calUrl;
        return true;
      }
      case 'yahoo': {
        const calUrl: string = this.calendars.getYahooCalendarUrl();
        this.reminderUrl = calUrl;
        return true;
      }
      case 'ics': {
        const fileName = this.calendars.getIcsFileName();
        const icsBlob = this.calendars.getIcsBlob();
        FileSaver.saveAs(icsBlob, fileName);
        return true;
      }
      default: {
        return true;
      }
    }

  }

}
