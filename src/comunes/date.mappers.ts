import dayjs from 'dayjs';
export class DateMapper {
  static stringToDate(dateStr: string): Date {
    return dayjs(dateStr).toDate();
  }
  static dateToString(date: Date, formato: string): string {
    return dayjs(date).format(formato);
  }
}
