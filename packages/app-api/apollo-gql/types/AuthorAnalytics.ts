import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

const CourseViewership = new GraphQLObjectType({
  name: 'CourseViewership',
  fields: {
    contentId: { type: GraphQLString },
    viewershipPercentageChange: { type: GraphQLFloat }
  }
});

export const CourseViewershipMetric = new GraphQLObjectType({
  name: 'CourseViewershipMetric',
  fields: {
    courseViewerships: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CourseViewership)))
    },
    monthsInPeriod: { type: GraphQLInt }
  }
});

export const CourseViewershipArgs = new GraphQLInputObjectType({
  name: 'CourseViewershipArgs',
  fields: {
    contentIds: {
      type: new GraphQLList(GraphQLString)
    },
    monthsInPeriod: { type: GraphQLInt }
  }
});

const ModuleViewership = new GraphQLObjectType({
  name: 'ModuleViewership',
  fields: {
    contentId: { type: GraphQLString },
    moduleId: { type: GraphQLString },
    title: { type: GraphQLString },
    order: { type: GraphQLFloat },
    viewershipPercentageChange: { type: GraphQLFloat }
  }
});

export const ModuleViewershipMetric = new GraphQLObjectType({
  name: 'ModuleViewershipMetric',
  fields: {
    moduleViewerships: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ModuleViewership)))
    },
    monthsInPeriod: { type: GraphQLInt }
  }
});

export const ModuleViewershipArgs = new GraphQLInputObjectType({
  name: 'ModuleViewershipArgs',
  fields: {
    contentId: {
      type: GraphQLString
    },
    monthsInPeriod: { type: GraphQLInt }
  }
});