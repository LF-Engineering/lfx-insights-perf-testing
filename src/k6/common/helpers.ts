export class Helpers {
  static getRandomElFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  static getRandomDate(from: Date, to: Date): Date {
    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
  }
  static normalizeTime(date: Date): number {
    return date.setHours(0,0,0,0);
  }
  static getRandomDateRange(from: Date, to: Date): [string, string] {
    const randomDate1 = this.getRandomDate(from, to);
    const randomDate2 = this.getRandomDate(from, to);
    return randomDate1.getTime() < randomDate2.getTime()
      ? [new Date(this.normalizeTime(randomDate1)).toISOString(), new Date(this.normalizeTime(randomDate2)).toISOString()]
      : [new Date(this.normalizeTime(randomDate2)).toISOString(), new Date(this.normalizeTime(randomDate1)).toISOString()];
  }
  static getDayDiff(d1: Date, d2: Date): number {
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
    return diffDays <=0 ? 0 : diffDays;
  }
  static getMonthDiff(d1: Date, d2: Date): number {
    let months: number;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
  /* same logic as in https://github.com/LF-Engineering/lfx-insights-ui/blob/56ff54f2e54b20c0a99063c83479bf347aa7e182/apps/frontend/src/app/shared/services/filter.service.ts*/
  static getGranularity(d1: Date, d2: Date): 'year' | 'month' | 'week' | 'day' {
    let granularity: 'year' | 'month' | 'week' | 'day' = 'month';
    const diffInDays = this.getDayDiff(d1, d2);
    const diffInMonth = this.getMonthDiff(d1, d2);
    if (diffInDays <= 30) {
      granularity = 'day';
    } else if (diffInMonth <= 6) {
      granularity = 'week';
    } else if (diffInMonth <= 60) {
      granularity = 'month';
    } else {
      granularity = 'year';
    }
    return granularity;
  }
}
