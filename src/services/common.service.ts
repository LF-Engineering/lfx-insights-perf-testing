export class CommonService {
  static isSet(v: any): boolean {
    return !(v === undefined || v === null || v == '');
  }
  static replaceVariablesInString(str: string, vars?: Record<string, string | number>): string {
    for (let key in vars) {
      let regex = new RegExp('\\$\\$' + key + '\\$\\$', 'g');
      str = str.replace(regex, vars[key].toString());
    }
    return str;
  }
}
