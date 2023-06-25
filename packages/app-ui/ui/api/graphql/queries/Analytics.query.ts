import gql from 'graphql-tag';


export const GET_ANALYTICS_DATA_VIEWERS = gql`
 query getAnalyticsData($analyticsFilters: AnalyticsArgs) {
   Viewers(analyticsFilters: $analyticsFilters) {
     points {
       date
       value
     }
     total {
       currentValue
       prevValue
     }
     aggPeriod
     updatedDate
   }
 }
`;


export const GET_ANALYTICS_DATA_VIEWTIME = gql`
 query getAnalyticsData($analyticsFilters: AnalyticsArgs) {
   ViewTime(analyticsFilters: $analyticsFilters) {
     points {
       date
       value
     }
     total {
       currentValue
       prevValue
     }
     aggPeriod
     updatedDate
   }
 }
`;


export const GET_ANALYTICS_DATA_VIEWERSHIP_PAYMENTS = gql`
 query getAnalyticsData($analyticsFilters: AnalyticsArgs) {
   ViewershipPayments(analyticsFilters: $analyticsFilters) {
     points {
       date
       value
     }
     total {
       currentValue
       prevValue
     }
     aggPeriod
     updatedDate
   }
 }
`;


export const GET_VIDEO_COURSES_ANALYTICS_COURSE_DATA = gql`
 query getVideoCoursesAnalyticsCourseData($analyticsFilters: AnalyticsArgs) {
   VideoCoursesAnalyticsCourseData(analyticsFilters: $analyticsFilters) {
     contentId
     viewers
     viewTime
     courseRank
   }
 }
`;


export const GET_PAYMENTS_ANALYTICS_COURSE_DATA = gql`
 query getPaymentsAnalyticsCourseData($analyticsFilters: AnalyticsArgs) {
   PaymentsAnalyticsCourseData(analyticsFilters: $analyticsFilters) {
     contentId
     viewershipPayments
   }
 }
`;


export const GET_MONTHLY_ANALYTICS_VIEWSHIP_PAYMENTS = gql`
 query getMonthlyAnalyticsData($analyticsFilters: MonthlyMetricArgs) {
   MonthlyViewershipPayments(analyticsFilters: $analyticsFilters) {
     points {
       date
       value
     }
   }
 }
`;


export const GET_MONTHLY_ANALYTICS_VIEWERS = gql`
 query getMonthlyAnalyticsData($analyticsFilters: MonthlyMetricArgs) {
   MonthlyViewers(analyticsFilters: $analyticsFilters) {
     points {
       date
       value
     }
   }
 }
`;


export const GET_MONTHLY_ANALYTICS_VIEW_TIME = gql`
 query getMonthlyAnalyticsData($analyticsFilters: MonthlyMetricArgs) {
   MonthlyViewTime(analyticsFilters: $analyticsFilters) {
     points {
       date
       value
     }
   }
 }
`;


export const GET_COURSE_RANKINGS_FOR_LAST_TWO_DAYS = gql`
 query getCourseRankingsForLastTwoDays($analyticsFilters: CourseRankingsArgs) {
   CourseRankingsForLastTwoDays(analyticsFilters: $analyticsFilters) {
     courseRankings {
       contentId
       prevDayRank
       prevDayViewedHours
       dayBeforePrevDayRank
       dayBeforePrevDayViewedHours
     }
     totalCourses
   }
 }
`;


export const GET_COURSE_VIEWERSHIP_FOR_LAST_TWO_PERIODS = gql`
 query getCourseViewershipForLastTwoPeriods($analyticsFilters: CourseViewershipArgs) {
   CourseViewershipForLastTwoPeriods(analyticsFilters: $analyticsFilters) {
     courseViewerships {
       contentId
       viewershipPercentageChange
     }
     monthsInPeriod
   }
 }
`;


export const GET_MODULE_VIEWERSHIP_FOR_LAST_TWO_PERIODS = gql`
 query getModuleViewershipForLastTwoPeriods($analyticsFilters: ModuleViewershipArgs) {
   ModuleViewershipForLastTwoPeriods(analyticsFilters: $analyticsFilters) {
     moduleViewerships {
       contentId
       moduleId
       title
       order
       viewershipPercentageChange
     }
     monthsInPeriod
   }
 }
`;


export const GET_CLIP_DETAILS = gql`
 query getCourseClipDetails($contentId: String) {
   CourseClipDetails(contentId: $contentId) {
     contentId
     durationInSeconds
     moduleDetails {
       moduleId
       durationInSeconds
       clipDetails {
         clipId
         order
         title
         durationInSeconds
       }
     }
   }
 }
`;


