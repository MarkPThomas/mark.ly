import courseViewershipAnalyticsRepo from 'common/database/repositories-orm/course-viewership-analytics';
import { CourseHoursViewership, CoursePercentageChangeViewership } from 'common/interfaces/analytics-interfaces';


export interface CourseViewerships {
  courseViewerships: CoursePercentageChangeViewership[];
  monthsInPeriod?: number;
  monthsInCurrentPeriod?: number;
  monthsInPreviousPeriod?: number;
}


const getCourseViewershipPercentageChange = (
  coursesViewerships: CourseHoursViewership[],
  monthsInCurrentPeriod: number,
  monthsInPreviousPeriod: number
) => {
  const viewershipChangeResults: CoursePercentageChangeViewership[] = [];


  coursesViewerships.forEach((course) => {
    const currentAvgHrsPerMonth = monthsInCurrentPeriod
      ? course.currentPeriodPaidViewedHours / monthsInCurrentPeriod
      : 0;
    const previousAvgHrsPerMonth = monthsInPreviousPeriod
      ? course.previousPeriodPaidViewedHours / monthsInPreviousPeriod
      : 0;
    const percentageChangeInCourseViewership = previousAvgHrsPerMonth
      ? // eslint-disable-next-line no-magic-numbers
      Math.round((100 * (currentAvgHrsPerMonth - previousAvgHrsPerMonth)) / previousAvgHrsPerMonth)
      : 0;


    viewershipChangeResults.push({
      contentId: course.contentId,
      viewershipPercentageChange: percentageChangeInCourseViewership
    });
  });
  return viewershipChangeResults;
};


export const getCourseViewershipChangeBetweenLastTwoPeriods = async (
  contentIds: string[],
  monthsInCurrentPeriod: number,
  monthsInPreviousPeriod?: number
): Promise<CourseViewerships> => {
  const syncedMonthsInPreviousPeriod =
    monthsInPreviousPeriod === undefined ? monthsInCurrentPeriod : monthsInPreviousPeriod;


  const results: CourseHoursViewership[] = await courseViewershipAnalyticsRepo().getCourseViewershipForLastTwoPeriods({
    contentIds,
    monthsInCurrentPeriod,
    monthsInPreviousPeriod: syncedMonthsInPreviousPeriod
  });


  const viewershipChangeResults: CoursePercentageChangeViewership[] = getCourseViewershipPercentageChange(
    results,
    monthsInCurrentPeriod,
    syncedMonthsInPreviousPeriod
  );


  return monthsInPreviousPeriod === undefined
    ? {
      courseViewerships: viewershipChangeResults,
      monthsInPeriod: monthsInCurrentPeriod
    }
    : {
      courseViewerships: viewershipChangeResults,
      monthsInCurrentPeriod,
      monthsInPreviousPeriod
    };
};


