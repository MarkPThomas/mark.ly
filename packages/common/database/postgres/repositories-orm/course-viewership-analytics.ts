import { EntityRepository, getCustomRepository, getConnection, Connection } from 'typeorm';


import { CourseHoursViewership } from '../../interfaces/analytics-interfaces';

@EntityRepository()
export class CourseViewershipAnalyticsRepository {
  private connection: Connection;

  constructor() {
    this.connection = getConnection();
  }

  async getCourseViewershipForLastTwoPeriods(params: {
    contentIds: string[];
    monthsInCurrentPeriod: number;
    monthsInPreviousPeriod?: number;
  }): Promise<CourseHoursViewership[]> {
    const { contentIds, monthsInCurrentPeriod, monthsInPreviousPeriod } = params;

    const actualMonthsInPreviousPeriod = monthsInPreviousPeriod ? monthsInPreviousPeriod : monthsInCurrentPeriod;
    const monthsInBothPeriods = monthsInCurrentPeriod + actualMonthsInPreviousPeriod;
    return this.connection.query(
      `
       with
       previous_period_paid_viewerships AS (
         SELECT content_id,
                SUM(round(view_time_seconds::numeric / 3600, 2)::float) AS viewed_hours
         FROM analytics.view_time_paid_view_v5
         WHERE content_id = ANY($1)
           AND date < (date_trunc('day', now()::timestamp) - CONCAT($2::numeric, ' month')::interval)::date
           AND date >= (date_trunc('day', now()::timestamp) - CONCAT($3::numeric, ' month')::interval)::date
         GROUP BY content_id
       ),
       current_period_paid_viewerships AS (
         SELECT content_id,
                SUM(round(view_time_seconds::numeric / 3600, 2)::float) AS viewed_hours
         FROM analytics.view_time_paid_view_v5
         WHERE content_id = ANY($1)
           AND date >= (date_trunc('day', now()::timestamp) - CONCAT($2::numeric, ' month')::interval)::date
         GROUP BY content_id
       )
       SELECT content.content AS "contentId",
              cp.viewed_hours  AS "currentPeriodPaidViewedHours",
              pp.viewed_hours AS "previousPeriodPaidViewedHours"
       FROM unnest($1) AS content
       LEFT JOIN previous_period_paid_viewerships AS pp on content.content = pp.content_id
       LEFT JOIN current_period_paid_viewerships AS cp on content.content = cp.content_id
       `,
      [contentIds, monthsInCurrentPeriod, monthsInBothPeriods]
    );
  }
}

export default () => getCustomRepository(CourseViewershipAnalyticsRepository);