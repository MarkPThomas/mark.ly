export interface Period {
  from: string;
  to: string;
}


export interface Point {
  date: Date;
  value: number;
}

export interface CourseRanking {
  contentId: string;
  prevDayRank: number;
  prevDayViewedHours: number;
  dayBeforePrevDayRank: number;
  dayBeforePrevDayViewedHours: number;
}

export interface CourseHoursViewership {
  contentId: string;
  currentPeriodPaidViewedHours: number;
  previousPeriodPaidViewedHours: number;
}

export interface CoursePercentageChangeViewership {
  contentId: string;
  viewershipPercentageChange: number;
}

export interface ModuleSecondsViewership {
  contentId: string;
  moduleId: string;
  title: string;
  order: number;
  currentPeriodPaidViewedSeconds: number;
  previousPeriodPaidViewedSeconds: number;
}

export interface ModulePercentageChangeViewership {
  contentId: string;
  moduleId: string;
  title: string;
  order: number;
  viewershipPercentageChange: number;
}