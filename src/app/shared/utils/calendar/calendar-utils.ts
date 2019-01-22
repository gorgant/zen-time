import * as moment from 'moment';

// Courtesy of https://jshor.github.io/angular-addtocalendar
export class CalendarUtils {

  /**
   * Convert 12-hour format to 24-hour.
   */
  private getMilitaryHours(hours: number): string {
    if (hours % 1 === 0.5) {
      return `${Math.floor(hours)}30`;
    }
    return `${Math.round(hours)}00`;
  }

  /**
   * Gets the duration between dates.
   */
  public getHoursDuration(startDate: string, endDate: string, timezone?: number): string {
    const start = moment(startDate);
    const end = moment(endDate);

    if (timezone) {
      start.utcOffset(timezone);
      end.utcOffset(timezone);
    }

    const hours = moment
      .duration(end.diff(start))
      .asHours();

    return this.getMilitaryHours(hours);
  }

  /**
   * Removes line breaks and ensures that the string is no
   * longer than maxLength chars (or 75 chars if none specified).
   */
  public formatIcsText(str: string, maxLength?: number): string {
    if (!str) {
      return '';
    }
    str = str.replace(/\n/g, '\\n');
    str = str.substring(0, maxLength);

    return str;
  }

  /**
   * Format time as a universal timestamp format w.r.t. the given timezone.
   *
   * @param timestamp valid RFC-2822 string timestamp
   * @param timezone  tz offset (in minutes) (optional)
   */
  private utcToUniversalTime(timestamp: string, timezone?: string): string {
    const dt = moment(timestamp);

    if (timezone) {
      dt.utcOffset(timezone);
    }
    return dt.format('YYYYMMDDTHHmmss');
  }

  private msToUniversalTime(milliseconds: number): string {
    const ms = milliseconds;
    const calendarDate = new Date(ms);
    const isoDate = calendarDate.toISOString();
    const universalTime = moment(isoDate).format('YYYYMMDDTHHmmss');
    return universalTime;
  }

  private calculateDueDateInMilliseconds(remainingTime: number): number {
    const dueDate: number = moment.now() + remainingTime;
    console.log('Calculated due date', dueDate);
    return dueDate;
  }

  public getStartEndDates(remainingTimeInMil: number): {startDate: string, endDate: string} {
    const dueDateInMil = this.calculateDueDateInMilliseconds(remainingTimeInMil);
    const formattedStartDate = this.msToUniversalTime(dueDateInMil);
    console.log('Formatted Start Date', formattedStartDate);
    const fifteenMinInMs = 1000 * 60 * 15;
    const formattedEndDate = this.msToUniversalTime(dueDateInMil + fifteenMinInMs);
    console.log('Formatted End Date', formattedEndDate);
    return {startDate: formattedStartDate, endDate: formattedEndDate};
  }

  /**
   * The name of the file will be the event title with alphanumeric chars
   * having the extension `.ics`.
   */
  public getIcsBlob(icsData: string): Blob {
    return new Blob([icsData], {
      type: 'application/octet-stream'
    });
  }

  /**
   * Transforms given string to be valid file name.
   */
  public getIcsFileName(title: string): string {
    if (!title) {
      return 'event.ics';
    }
    return `${title.replace(/[^\w ]+/g, '')}.ics`.replace(/\s+/g, '');
  }

  /**
   * Returns a random base 36 hash for iCal UID.
   */
  public getUid(): string {
    return Math.random().toString(36).substr(2);
  }

  /**
   * Returns a universal timestamp of current time.
   */
  public getTimeCreated(): string {
    return moment().format('YYYYMMDDTHHmmss');
  }
}
