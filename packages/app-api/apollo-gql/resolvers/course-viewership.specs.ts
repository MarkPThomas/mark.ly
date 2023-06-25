import courseViewershipAnalyticsRepo from 'common/database/repositories-orm/course-viewership-analytics';
import guid from 'common/util-ts/guid';
import { getCourseViewershipChangeBetweenLastTwoPeriods } from './course-viewership';
jest.mock('common/db/repositories-orm/course-viewership-analytics', () => jest.fn());

describe('#course-viewership', () => {
  let contentIds;
  let courseViewerships;
  let mockCourseViewershipAnalyticsRepo;

  describe('getCourseViewershipChangeBetweenLastTwoPeriods', () => {
    beforeAll(() => {
      contentIds = [guid(), guid(), guid()];

      courseViewerships = [
        {
          contentId: 'content-id-123',
          previousPeriodPaidViewedHours: 3251.23,
          currentPeriodPaidViewedHours: 6000
        },
        {
          contentId: 'content-id-234',
          previousPeriodPaidViewedHours: 2000.55,
          currentPeriodPaidViewedHours: 2000.59
        },
        {
          contentId: 'content-id-345',
          previousPeriodPaidViewedHours: 5400.35,
          currentPeriodPaidViewedHours: 2500.48
        }
      ];

      mockCourseViewershipAnalyticsRepo = {
        getCourseViewershipForLastTwoPeriods: jest.fn().mockReturnValue(courseViewerships)
      };

      (courseViewershipAnalyticsRepo as jest.Mock).mockReturnValue(mockCourseViewershipAnalyticsRepo);
    });

    it('Should return course viewerships for last two periods of different lengths', async () => {
      const monthsInCurrentPeriod = 6;
      const monthsInPreviousPeriod = 4;
      const result = await getCourseViewershipChangeBetweenLastTwoPeriods(
        contentIds,
        monthsInCurrentPeriod,
        monthsInPreviousPeriod
      );
      let expectedResult = {
        courseViewerships: [
          {
            contentId: 'content-id-123',
            viewershipPercentageChange: 23
          },
          {
            contentId: 'content-id-234',
            viewershipPercentageChange: -33
          },
          {
            contentId: 'content-id-345',
            viewershipPercentageChange: -69
          }
        ],
        monthsInCurrentPeriod: 6,
        monthsInPreviousPeriod: 4
      };
      expect(result).toEqual(expectedResult);
    });

    it('Should return course viewerships for last two periods of equal lengths', async () => {
      const monthsInPeriod = 6;
      const result = await getCourseViewershipChangeBetweenLastTwoPeriods(contentIds, monthsInPeriod);
      let expectedResult = {
        courseViewerships: [
          {
            contentId: 'content-id-123',
            viewershipPercentageChange: 85
          },
          {
            contentId: 'content-id-234',
            viewershipPercentageChange: 0
          },
          {
            contentId: 'content-id-345',
            viewershipPercentageChange: -54
          }
        ],
        monthsInPeriod: 6
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCourseViewershipChangeBetweenLastTwoPeriods with zero values', () => {
    it('Should return no change if previous period months is 0', async () => {
      contentIds = [guid()];

      courseViewerships = [
        {
          contentId: 'content-id-123',
          previousPeriodPaidViewedHours: 3251.23,
          currentPeriodPaidViewedHours: 6000
        }
      ];

      mockCourseViewershipAnalyticsRepo = {
        getCourseViewershipForLastTwoPeriods: jest.fn().mockReturnValue(courseViewerships)
      };

      (courseViewershipAnalyticsRepo as jest.Mock).mockReturnValue(mockCourseViewershipAnalyticsRepo);

      const monthsInCurrentPeriod = 6;
      const monthsInPreviousPeriod = 0;
      const result = await getCourseViewershipChangeBetweenLastTwoPeriods(
        contentIds,
        monthsInCurrentPeriod,
        monthsInPreviousPeriod
      );
      let expectedResult = {
        courseViewerships: [
          {
            contentId: 'content-id-123',
            viewershipPercentageChange: 0
          }
        ],
        monthsInCurrentPeriod: 6,
        monthsInPreviousPeriod: 0
      };
      expect(result).toEqual(expectedResult);
    });

    it('Should return -100% if current period months is 0', async () => {
      contentIds = [guid()];

      courseViewerships = [
        {
          contentId: 'content-id-123',
          previousPeriodPaidViewedHours: 3251.23,
          currentPeriodPaidViewedHours: 6000
        }
      ];

      mockCourseViewershipAnalyticsRepo = {
        getCourseViewershipForLastTwoPeriods: jest.fn().mockReturnValue(courseViewerships)
      };

      (courseViewershipAnalyticsRepo as jest.Mock).mockReturnValue(mockCourseViewershipAnalyticsRepo);

      const monthsInCurrentPeriod = 0;
      const monthsInPreviousPeriod = 4;
      const result = await getCourseViewershipChangeBetweenLastTwoPeriods(
        contentIds,
        monthsInCurrentPeriod,
        monthsInPreviousPeriod
      );
      let expectedResult = {
        courseViewerships: [
          {
            contentId: 'content-id-123',
            viewershipPercentageChange: -100
          }
        ],
        monthsInCurrentPeriod: 0,
        monthsInPreviousPeriod: 4
      };
      expect(result).toEqual(expectedResult);
    });

    it('Should return no change if previous period watched is 0', async () => {
      contentIds = [guid()];

      courseViewerships = [
        {
          contentId: 'content-id-123',
          previousPeriodPaidViewedHours: 0,
          currentPeriodPaidViewedHours: 6000
        }
      ];

      mockCourseViewershipAnalyticsRepo = {
        getCourseViewershipForLastTwoPeriods: jest.fn().mockReturnValue(courseViewerships)
      };

      (courseViewershipAnalyticsRepo as jest.Mock).mockReturnValue(mockCourseViewershipAnalyticsRepo);

      const monthsInPeriod = 6;
      const result = await getCourseViewershipChangeBetweenLastTwoPeriods(contentIds, monthsInPeriod);
      let expectedResult = {
        courseViewerships: [
          {
            contentId: 'content-id-123',
            viewershipPercentageChange: 0
          }
        ],
        monthsInPeriod: 6
      };
      expect(result).toEqual(expectedResult);
    });

    it('Should return -100% if current period watched is 0', async () => {
      contentIds = [guid()];

      courseViewerships = [
        {
          contentId: 'content-id-123',
          previousPeriodPaidViewedHours: 3251.23,
          currentPeriodPaidViewedHours: 0
        }
      ];

      mockCourseViewershipAnalyticsRepo = {
        getCourseViewershipForLastTwoPeriods: jest.fn().mockReturnValue(courseViewerships)
      };

      (courseViewershipAnalyticsRepo as jest.Mock).mockReturnValue(mockCourseViewershipAnalyticsRepo);

      const monthsInPeriod = 6;
      const result = await getCourseViewershipChangeBetweenLastTwoPeriods(contentIds, monthsInPeriod);
      let expectedResult = {
        courseViewerships: [
          {
            contentId: 'content-id-123',
            viewershipPercentageChange: -100
          }
        ],
        monthsInPeriod: 6
      };
      expect(result).toEqual(expectedResult);
    });
  });
});