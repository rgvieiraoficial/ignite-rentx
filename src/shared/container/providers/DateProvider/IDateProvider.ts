interface IDateProvider {
  addHours(hours: number): Date;
  addDays(days: number): Date;
  compareIfBefore(start_date: Date, end_date: Date): boolean;
  compareInHours(start_date: Date, end_date: Date): number;
  compareInDays(start_date: Date, end_date: Date): Number;
  convertToUtc(date: Date): string;
  dateNow(): Date;
}

export { IDateProvider };