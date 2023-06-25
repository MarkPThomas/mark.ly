import { ContentType } from 'common/database/models/Content';
import { Context } from 'koa';


import logger from '../../../logger';
import { validateOwnership } from '../../resolvers/analytics/analytics-validation';
import { getCourseViewershipChangeBetweenLastTwoPeriods } from '../../resolvers/course-viewership';
import { getModuleViewershipChangeBetweenLastTwoPeriods } from '../../resolvers/module-viewership';
import {
  CourseViewershipArgs,
  CourseViewershipMetric,
  ModuleViewershipArgs,
  ModuleViewershipMetric,
} from '../../types/AuthorAnalytics';

interface ICourseViewershipArgs {
  analyticsFilters: {
    contentIds: string[];
    monthsInPeriod: number;
  };
}

export const CourseViewershipForLastTwoPeriods = {
  name: 'CourseViewershipForLastTwoPeriods',
  type: CourseViewershipMetric,
  args: { analyticsFilters: { type: CourseViewershipArgs } },
  resolve: async (root: unknown, args: ICourseViewershipArgs, ctx: Context) => {
    const authorId = ctx.state.authorId;
    const { contentIds, monthsInPeriod } = args.analyticsFilters;


    logger.info({
      layer: 'SERVICE',
      message: `GraphQL query CourseViewershipForLastTwoPeriods; With requestId ${ctx.state.requestId}`,
      payload: {
        authorId,
        analyticsFilters: args.analyticsFilters
      }
    });


    await validateOwnership(authorId, contentIds, [ContentType.VIDEO_COURSE]);


    return getCourseViewershipChangeBetweenLastTwoPeriods(contentIds, monthsInPeriod);
  }
};


interface IModuleViewershipArgs {
  analyticsFilters: {
    contentId: string;
    monthsInPeriod: number;
  };
}


export const ModuleViewershipForLastTwoPeriods = {
  name: 'ModuleViewershipForLastTwoPeriods',
  type: ModuleViewershipMetric,
  args: { analyticsFilters: { type: ModuleViewershipArgs } },
  resolve: async (root: unknown, args: IModuleViewershipArgs, ctx: Context) => {
    const authorId = ctx.state.authorId;
    const { contentId, monthsInPeriod } = args.analyticsFilters;


    logger.info({
      layer: 'SERVICE',
      message: `GraphQL query ModuleViewershipForLastTwoPeriods; With requestId ${ctx.state.requestId}`,
      payload: {
        authorId,
        analyticsFilters: args.analyticsFilters
      }
    });


    await validateOwnership(authorId, [contentId], [ContentType.VIDEO_COURSE]);


    return getModuleViewershipChangeBetweenLastTwoPeriods(contentId, monthsInPeriod);
  }
};


