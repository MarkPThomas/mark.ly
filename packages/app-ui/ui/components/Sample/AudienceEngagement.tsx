
/*eslint complexity: ["error", 34]*/
import { useQuery, useLazyQuery } from '@apollo/client';
import Dropdown from '@pluralsight/ps-design-system-dropdown';
import {
  AuthorPublishedContentQuery,
  ModulePeriodViewershipQuery,
  CoursePeriodViewershipQuery,
  CourseClipDetailsQuery
} from 'api/graphql/models/Content.models';
import {
  GET_MODULE_VIEWERSHIP_FOR_LAST_TWO_PERIODS,
  GET_COURSE_VIEWERSHIP_FOR_LAST_TWO_PERIODS,
  GET_CLIP_DETAILS
} from 'api/graphql/queries/Analytics.query';
import { getAuthorPublishedContent } from 'api/graphql/queries/Content.query';
import { PositiveNegativeBarChart } from 'components/Analytics/components/PositiveNegativeBarChart/PositiveNegativeBarChart';
import {
  SectionHeader,
  SectionHeaderSubtitle,
  SectionHeaderTitle
} from 'components/Analytics/components/styled-wrappers';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router';
import { ErrorSection } from 'shared/components/ErrorSection/ErrorSection';
import { ChartMetricData } from 'shared/components/metrics/ChartMetricData';
import { MetricValueContainer } from 'shared/components/metrics/styled-components';


import { COURSE_VIEWERSHIP } from '../../../../common/constants/constants';
import { toHMSFormat, toPercentageFormat } from '../../../../shared/utils/utils';
import { TabSection } from '../LearnerFeedback/styled-components';


import { MaintenanceAlerts } from './components/MaintenanceAlerts';
import { ModulesSummaries, CourseModule, CourseModules } from './components/ModulesSummaries';
import { AudienceEngagementHeader, AudienceEngagementRow, StatItem } from './styled-components';


export const AudienceEngagement = () => {
  const location = useLocation();
  const history = useHistory();


  const { data: content } = useQuery<AuthorPublishedContentQuery>(getAuthorPublishedContent);


  const courses = content?.AllAuthorPublishedContent.map((course) => ({
    value: course.key,
    displayName: course.displayName
  }));


  const [contentId, setContentId] = useState<string | undefined>(location.search.split('=')[1]);
  const [courseName, setCourseName] = useState<string>('');


  const [getClipDetails, { data: clipDetailsData, loading: clipDetailsDataLoading, error: clipDetailsDataError }] =
    useLazyQuery<CourseClipDetailsQuery>(GET_CLIP_DETAILS);


  const [
    getModuleViewership,
    { data: moduleViewershipData, loading: moduleViewershipDataLoading, error: moduleViewershipDataError }
  ] = useLazyQuery<ModulePeriodViewershipQuery>(GET_MODULE_VIEWERSHIP_FOR_LAST_TWO_PERIODS);
  const [
    getCourseViewership,
    { data: courseViewershipData, loading: courseViewershipDataLoading, error: courseViewershipDataError }
  ] = useLazyQuery<CoursePeriodViewershipQuery>(GET_COURSE_VIEWERSHIP_FOR_LAST_TWO_PERIODS);


  // TODO: Associate starRatingDrop to trigger on associated module
  // TODO: Associate negativeFeedbackDrop tp trigger on associated module


  useEffect(() => {
    getClipDetails({
      variables: {
        contentId
      }
    });


    getModuleViewership({
      variables: {
        analyticsFilters: {
          contentId,
          monthsInPeriod: COURSE_VIEWERSHIP.monthsInPeriod
        }
      }
    });


    getCourseViewership({
      variables: {
        analyticsFilters: {
          contentIds: [contentId],
          monthsInPeriod: COURSE_VIEWERSHIP.monthsInPeriod
        }
      }
    });


    setCourseName(getCourseName());
  }, [contentId]);


  useEffect(() => {
    const video = {
      clipId: 'b5cd209b-c1a4-4408-872c-ff3859ddf169',
      versionId: '89cddbf0-e762-483b-a2f9-4cf085b49d3a',
      autoPlay: false
    };


    const timeOutTime = 100;


    setTimeout(() => {
      (window as any).EmbeddablePlayer.render({
        el: document.getElementById('ps-embeddable-player'),
        boundedContext: 'course',
        userId: contentId,
        isStagingEnv: true
      }).play(video);
    }, timeOutTime);


    const _satellite = (global as any)._satellite;
    if (_satellite) {
      _satellite.pageBottom();
    }
  }, []);


  const changeCourse = (courseId: string | undefined) => {
    setContentId(courseId);
    setUrl(courseId);
  };


  const setUrl = (courseId) => {
    history.push(`${location.pathname}?courseId=${courseId}`);
  };


  // TODO: Decide how/if to handle long loading state
  if (clipDetailsDataLoading || moduleViewershipDataLoading || courseViewershipDataLoading) {
    return (
      // <MainContainer withTopMargin={isExperiencePresent}>
      //   <PublishedLoading />
      // </MainContainer>
      <></>
    );
  }


  // TODO: Decide how/if to handle loading errors
  if (clipDetailsDataError || moduleViewershipDataError || courseViewershipDataError) {
    return <ErrorSection error={moduleViewershipDataError} sectionTitle={'Audience Engagement'} />;
  }


  // TODO: Decide how/if to handle null loading results
  // if (!data) {
  //   // || !viewershipData) {
  //   return null;
  // }


  const clipDetails = clipDetailsData ? clipDetailsData.CourseClipDetails.moduleDetails : [];


  const moduleViewerships = moduleViewershipData
    ? moduleViewershipData.ModuleViewershipForLastTwoPeriods.moduleViewerships
    : [];


  const avgCourseViewDuration = 3665;
  const courseDurationInSeconds = clipDetailsData?.CourseClipDetails.durationInSeconds;
  const avgCourseViewPercent = courseDurationInSeconds
    ? // eslint-disable-next-line no-magic-numbers
    Math.round((100 * avgCourseViewDuration) / courseDurationInSeconds)
    : 0;


  const coursePercentageChange =
    courseViewershipData?.CourseViewershipForLastTwoPeriods.courseViewerships[0].viewershipPercentageChange || 0;


  const getCourseName = () => {
    const course = courses?.find((course) => course.value === contentId);


    return course ? course.displayName : '';
  };


  const courseModules: CourseModule[] =
    moduleViewershipData?.ModuleViewershipForLastTwoPeriods.moduleViewerships.map((module) => {
      let moduleLengthInSeconds = 0;
      let moduleClipDetails;
      clipDetails.forEach((moduleClips) => {
        if (moduleClips.moduleId === module.moduleId) {
          moduleLengthInSeconds = moduleClips.durationInSeconds;
          moduleClipDetails = moduleClips.clipDetails;
        }
      });


      return {
        order: module.order,
        title: module.title,
        lengthInSeconds: moduleLengthInSeconds,
        moduleAlerts: {
          viewDrop: module.viewershipPercentageChange <= COURSE_VIEWERSHIP.percentageChangeThreshold,
          // TODO: implement a proper trigger when this data is brought in
          // eslint-disable-next-line no-magic-numbers
          starRatingDrop: Math.random() === 0.5,
          // TODO: implement a proper trigger when this data is brought in
          // eslint-disable-next-line no-magic-numbers
          negativeFeedback: Math.random() === 0.2
        },
        clips: moduleClipDetails
      };
    }) || [];


  const courseModuleSummaries: CourseModules = {
    title: courseName,
    modules: courseModules
  };


  const maintenanceAlerts = {
    courseViewDrop: coursePercentageChange <= COURSE_VIEWERSHIP.percentageChangeThreshold,
    starRatingDrop: true, // TODO: implement a proper trigger when this data is brought in. Trigger if any module in courseModules has a trigger.
    negativeFeedback: true // TODO: implement a proper trigger when this data is brought in. Trigger if any module in courseModules has a trigger.
  };


  return (
    <>
      <TabSection>
        <AudienceEngagementHeader>
          <SectionHeader>
            <SectionHeaderTitle>Audience Engagement: </SectionHeaderTitle>
            <SectionHeaderSubtitle>Rolling {COURSE_VIEWERSHIP.monthsInPeriod} month comparison</SectionHeaderSubtitle>
          </SectionHeader>
          {contentId && (
            <Dropdown
              placeholder={courseName}
              value={contentId}
              menu={courses?.map((course) => (
                <Dropdown.Item key={course.value} value={course.value}>
                  {course.displayName}
                </Dropdown.Item>
              ))}
              onChange={(evt, val) => {
                changeCourse(val?.toString());
              }}
            />
          )}
          {!contentId && (
            <Dropdown
              placeholder="Select"
              menu={courses?.map((course) => (
                <Dropdown.Item key={course.value} value={course.value}>
                  {course.displayName}
                </Dropdown.Item>
              ))}
              onChange={(evt, val) => {
                changeCourse(val?.toString());
              }}
            />
          )}
        </AudienceEngagementHeader>
        <AudienceEngagementRow>
          <MetricValueContainer>
            <StatItem>
              <ChartMetricData
                metricTitle={'Average % Viewed'}
                metricDescription={`The average percentage of content viewed in this course for the last ${COURSE_VIEWERSHIP.monthsInPeriod} months`}
                selectedRangeType={{ key: 'rolling-months', displayName: 'rolling-months' }}
                dateRange={{ from: moment(), to: moment() }}
                total={avgCourseViewPercent}
                differenceNumber={coursePercentageChange}
                format={toPercentageFormat}
                rollingLength={COURSE_VIEWERSHIP.monthsInPeriod}
              />
            </StatItem>
            <StatItem>
              <ChartMetricData
                metricTitle={'Average View Duration'}
                metricDescription={`The average view time duration in this course for the last ${COURSE_VIEWERSHIP.monthsInPeriod} months`}
                total={avgCourseViewDuration}
                format={toHMSFormat}
              />
            </StatItem>
          </MetricValueContainer>
          <MetricValueContainer>
            <MaintenanceAlerts label="MAINTENANCE ALERTS" alerts={maintenanceAlerts}></MaintenanceAlerts>
          </MetricValueContainer>
        </AudienceEngagementRow>
        {moduleViewerships && moduleViewerships.length > 0 && (
          <PositiveNegativeBarChart
            viewershipData={moduleViewerships}
            rollingLength={COURSE_VIEWERSHIP.monthsInPeriod}
          ></PositiveNegativeBarChart>
        )}
      </TabSection>
      <TabSection>
        <div id="ps-embeddable-player"></div>
        <ModulesSummaries courseModules={courseModuleSummaries} />
      </TabSection>
    </>
  );
};


