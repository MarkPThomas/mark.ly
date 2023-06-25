import { GraphQLObjectType } from 'graphql';

import * as AuthorAnalytics from './AuthorAnalytics';

export default new GraphQLObjectType({
  name: 'QueryType',
  fields: {
    ...AuthorAnalytics,
  }
});