export class Helpers {
  static getRandomElFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  static getRandomDate(from: Date, to: Date): Date {
    const fromTime = from.getTime();
    const toTime = to.getTime();
    return new Date(fromTime + Math.random() * (toTime - fromTime));
  }
  static getRandomDateRange(from: Date, to: Date): [string, string] {
    const randomDate1 = this.getRandomDate(from, to);
    const randomDate2 = this.getRandomDate(from, to);
    return randomDate1.getTime() < randomDate2.getTime()
      ? [randomDate1.toISOString(), randomDate2.toISOString()]
      : [randomDate2.toISOString(), randomDate1.toISOString()];
  }
  static getMonthDiff(d1: Date, d2: Date): number {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
  static getGranularity(d1: Date, d2: Date): 'year' | 'month' {
    const monthDiff = this.getMonthDiff(d1, d2);
    return monthDiff > 12 ? 'year' : 'month';
  }
}
