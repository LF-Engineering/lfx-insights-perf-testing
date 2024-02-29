export class BasicClass {
  protected checkEnvParams(params: (string | undefined)[]): boolean {
    return params.some((el) => el === undefined);
  }
}
