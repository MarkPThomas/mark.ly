import { GraphQLObjectType } from 'graphql';

import * as AuthorFeedback from './AuthorFeedback';

export default new GraphQLObjectType({
  name: 'MutationType',
  fields: {
    ...AuthorFeedback,
  }
});