import { GraphQLSchema } from 'graphql';

import mutation from './mutations';
import query from './queries';

export default new GraphQLSchema({
  query,
  mutation
});