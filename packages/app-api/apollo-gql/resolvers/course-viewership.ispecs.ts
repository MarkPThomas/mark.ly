import createDbConnection, { createConnection, Connection } from 'common/database/connection';

import config from '../../config';
import courseViewershipsMocks from '../../test/mocks/viewerships-mock';

import { getCourseViewershipChangeBetweenLastTwoPeriods, CourseViewerships } from './course-viewership';

const contentIds = ['content-id-123', 'content-id-234', 'content-id-345'];
const currentPeriodMonthsLength = 3;
const previousPeriodMonthsLength = 2;
const extraContentIds = ['content-id-888'];

const insertCourseViewershipsTestData = async (connection: Connection, courseViewershipRecords) => {
  await connection.query(
    `
 INSERT INTO analytics.view_time_paid_v5 (date, content_id, module_id, view_time_seconds)
 select date, content_id, module_id, view_time_seconds from unnest(
     $1::date[],
     $2::text[],
     $3::text[],
     $4::integer[]
   ) as s(date, content_id, module_id, view_time_seconds)
`,
    [
      courseViewershipRecords.paidViewership.map((c) => c.date),
      courseViewershipRecords.paidViewership.map((c) => c.contentId),
      courseViewershipRecords.paidViewership.map((c) => c.moduleId),
      courseViewershipRecords.paidViewership.map((c) => c.viewTimeSeconds)
    ]
  );
};

const refreshViewershipView = async (connection: Connection) => {
  await connection.query('refresh materialized view analytics.view_time_paid_view_v5');
};

const deleteCourseViewershipsTestData = async (connection: Connection, contentIds: string[]) => {
  await connection.query(
    `
   delete from analytics.view_time_paid_v5 where content_id = ANY($1)
  `,
    [contentIds]
  );
};

describe('course-viewership', () => {
  let auroraConnection: Connection;
  let dbConnection: Connection;
  const allCourses = [...contentIds, ...extraContentIds];

  beforeAll(async () => {
    dbConnection = await createDbConnection(config.db);
    await insertCourseViewershipsTestData(dbConnection, courseViewershipsMocks);
    await refreshViewershipView(dbConnection);
  });

  afterAll(async () => {
    await deleteCourseViewershipsTestData(dbConnection, allCourses);
    await refreshViewershipView(dbConnection);
    await auroraConnection.close();
    await dbConnection.close();
  });

  describe('#getCourseViewerships', () => {
    let result: CourseViewerships;

    beforeAll(async () => {
      result = await getCourseViewershipChangeBetweenLastTwoPeriods(
        contentIds,
        currentPeriodMonthsLength,
        previousPeriodMonthsLength
      );
    });

    it('should return the correct number of results', () => {
      expect(result.courseViewerships.length).toEqual(3);
    });

    it('should return the correct course viewership change', () => {
      result.courseViewerships.forEach((result) => {
        expect(result.viewershipPercentageChange).toEqual(
          courseViewershipsMocks.courseResults[result.contentId].viewershipPercentageChange
        );
      });
    });

    it('should return current and previous period lengths in months', () => {
      expect(result.monthsInCurrentPeriod === currentPeriodMonthsLength).toBeTruthy();
      expect(result.monthsInPreviousPeriod === previousPeriodMonthsLength).toBeTruthy();
    });
  });
});