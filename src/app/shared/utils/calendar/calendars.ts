import { CalendarData } from '../../models/calendar-data.model';
import { CalendarUtils } from './calendar-utils';
import { Timer } from 'src/app/timers/models/timer.model';
import { Countdown } from '../../models/countdown.model';

// Courtesy of https://jshor.github.io/angular-addtocalendar
export class Calendars {

  private utils = new CalendarUtils();
  private calendarData: CalendarData;

  constructor(
    private timer: Timer
  ) {
    this.generateCalendarData();
  }

  private generateCalendarData() {
    const countdownClock = new Countdown(this.timer);
    const remainingTime = countdownClock.calcRemainingTime();
    const startAndEndDates = this.utils.getStartEndDates(remainingTime);
    const startDate = startAndEndDates.startDate;
    const endDate = startAndEndDates.endDate;
    this.calendarData = {
      title: this.timer.title,
      startDate: startDate,
      endDate: endDate ,
      description: this.timer.notes,
      location: ''
    };
  }

  public getIcsFileName(): string {
    return this.utils.getIcsFileName(this.timer.title);
  }

  public getIcsBlob(): Blob {
    const icsData = this.getIcsCalendar();
    return this.utils.getIcsBlob(icsData);
  }

  public getYahooCalendarUrl(): string {
    let yahooCalendarUrl = 'http://calendar.yahoo.com/?v=60&view=d&type=20';
    const duration = this.utils.getHoursDuration(this.calendarData.startDate, this.calendarData.endDate);

    yahooCalendarUrl += '&TITLE=' + this.calendarData.title;
    yahooCalendarUrl += '&ST=' + this.calendarData.startDate + '&DUR=' + duration;
    yahooCalendarUrl += '&DESC=' + this.calendarData.description;
    yahooCalendarUrl += '&in_loc=' + this.calendarData.location;

    return yahooCalendarUrl;
  }

  public getMicrosoftCalendarUrl(): string {
    let microsoftCalendarUrl = 'https://outlook.live.com/owa/?path=/calendar/action/compose&rru=addevent';
    microsoftCalendarUrl += '&startdt=' + this.calendarData.startDate + '&enddt=' + this.calendarData.endDate;
    microsoftCalendarUrl += '&subject=' + this.calendarData.title;
    microsoftCalendarUrl += '&body=' + this.calendarData.description;

    return microsoftCalendarUrl;
  }

  public getGoogleCalendarUrl(): string {
    let googleCalendarUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    googleCalendarUrl += '&text=' + this.calendarData.title;
    googleCalendarUrl += '&dates=' + this.calendarData.startDate + '/' + this.calendarData.endDate;
    googleCalendarUrl += '&details=' + this.calendarData.description;
    googleCalendarUrl += '&location=' + this.calendarData.location;

    return googleCalendarUrl;
  }

  private getIcsCalendar(): string {
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'CLASS:PUBLIC',
      'DESCRIPTION:' + this.utils.formatIcsText(this.calendarData.description, 62),
      'DTSTART:' + this.calendarData.startDate,
      'DTEND:' + this.calendarData.endDate,
      'LOCATION:' + this.utils.formatIcsText(this.calendarData.location, 64),
      'SUMMARY:' + this.utils.formatIcsText(this.calendarData.title, 66),
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
      'END:VCALENDAR',
      'UID:' + this.utils.getUid(),
      'DTSTAMP:' + this.utils.getTimeCreated(),
      'PRODID:zen-timer'
    ].join('\n');
  }
}
