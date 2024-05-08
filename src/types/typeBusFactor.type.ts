export interface ITypeBusFactorSf {
  ROW_NUMBER: number;
  USERNAME: string;
  DISPLAY_NAME: string;
  LOGO_URL: string;
  CNT: number
  PERCENT: number;
  CUMULATIVE_PERCENT: number;
}

export interface ITypeBusFactorParams {
  timeRangeName: ITimeRangeName;
  type: IActivityType;
  project: string;
}
