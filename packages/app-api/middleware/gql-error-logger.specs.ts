import { GraphQLError } from 'graphql';
import { graphQLErrorLogger } from './gql-error-logger';
import logger from '../logger';

describe('GraphQL Error logger', () => {
  let loggerStub;


  beforeAll(() => {
    loggerStub = jest.spyOn(logger, 'error');
  });

  it('should log Error', () => {
    const error = new GraphQLError('Error');

    graphQLErrorLogger(logger)(error);

    expect(loggerStub).toHaveBeenCalled();
  });
});