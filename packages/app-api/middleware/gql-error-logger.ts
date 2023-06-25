import { Loggers } from 'common/logger';
import { GraphQLError } from 'graphql';


export const graphQLErrorLogger =
  (logger: Loggers) =>
    (error: GraphQLError): GraphQLError => {
      logger.error({ message: 'GraphQL error middleware.', layer: 'MIDDLEWARE', errorMessage: error.message }, error);

      return error;
    };