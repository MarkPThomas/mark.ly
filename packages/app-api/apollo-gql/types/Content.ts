import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
  Kind
} from 'graphql';


const ClipDetail = new GraphQLObjectType({
  name: 'ClipDetail',
  fields: {
    clipId: { type: GraphQLString },
    title: { type: GraphQLString },
    order: { type: GraphQLInt },
    durationInSeconds: { type: GraphQLFloat }
  }
});

const ModuleClipDetail = new GraphQLObjectType({
  name: 'ModuleClipDetail',
  fields: {
    moduleId: { type: GraphQLString },
    durationInSeconds: { type: GraphQLFloat },
    clipDetails: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ClipDetail)))
    }
  }
});

export const CourseClipDetailResponse = new GraphQLObjectType({
  name: 'CourseClipDetailResponse',
  fields: {
    contentId: { type: GraphQLString },
    durationInSeconds: { type: GraphQLFloat },
    moduleDetails: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ModuleClipDetail)))
    }
  }
});


