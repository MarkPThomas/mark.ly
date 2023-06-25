interface Type {
  key: string;
  icon: string;
  displayName: string;
}


interface Status {
  status: string;
  statusDisplayName: string;
  statusDisplayDate: string;
  displayUpdatedDate: string;
}


interface Team {
  handle: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  email: string;
  persona: string[];
}


export interface GetPublishedQuery {
  Published: {
    id: string;
    type: Type;
    visible: boolean;
    title: string;
    deadlineDate: string;
    totalItems?: number;
    completedItems?: number;
    contentToolsPath: string;
    publishedDate: string;
    createdDate: string;
    statusObject: Status;
    learnerLink: string;
    updatedDate: string;
    team: Team[];
  }[];
}


export interface GetAllPublishedCoursesQuery {
  AllAuthorPublishedVideoCourses: {
    key: string;
    displayName: string;
  }[];
}
interface CourseDailyRank {
  contentId: string;
  prevDayRank: number;
  prevDayViewedHours: number;
  dayBeforePrevDayRank: number;
  dayBeforePrevDayViewedHours: number;
}


export interface CourseDailyRankQuery {
  CourseRankingsForLastTwoDays: {
    courseRankings: CourseDailyRank[];
    totalCourses: number;
  };
}


interface CoursePeriodViewership {
  contentId: string;
  viewershipPercentageChange: number;
}


export interface CoursePeriodViewershipQuery {
  CourseViewershipForLastTwoPeriods: {
    courseViewerships: CoursePeriodViewership[];
    monthsInPeriod: number;
  };
}


export interface ModulePeriodViewership {
  contentId: string;
  moduleId: string;
  title: string;
  order: number;
  viewershipPercentageChange: number;
}


export interface ModulePeriodViewershipQuery {
  ModuleViewershipForLastTwoPeriods: {
    moduleViewerships: ModulePeriodViewership[];
    monthsInPeriod: number;
  };
}


export interface ClipDetails {
  clipId: string;
  title: string;
  order: number;
  durationInSeconds: number;
}


export interface ModuleDetails {
  moduleId: string;
  durationInSeconds: number;
  clipDetails: ClipDetails[];
}


export interface CourseClipDetails {
  contentId: string;
  durationInSeconds: number;
  moduleDetails: ModuleDetails[];
}


export interface CourseClipDetailsQuery {
  CourseClipDetails: CourseClipDetails;
}


interface AuthorPublishedContent {
  key: string;
  type: string;
  displayName: string;
  hasNew: boolean;
  newCount: number;
}


export interface AuthorPublishedContentQuery {
  AllAuthorPublishedContent: AuthorPublishedContent[];
}


