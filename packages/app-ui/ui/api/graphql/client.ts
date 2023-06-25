import { ApolloClient, ApolloLink } from '@apollo/client';
import { defaultDataIdFromObject, InMemoryCache } from '@apollo/client/cache';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { createUploadLink } from 'apollo-upload-client';

const UNAUTHORIZED_CODE = 401;

const cache = new InMemoryCache({
  dataIdFromObject: (object: any) => {
    switch (object.__typename) {
      case 'TerminalObjective':
        return `${object.id}.${object.enablingObjectives.reduce((acc, i) => acc + i.id, '')}`;
      case 'AuthorVideoCourseFeedback':
        return `${object.id}.${object.modules.reduce((acc, n) => acc + n.moduleId, '')}`;
      default:
        return defaultDataIdFromObject(object);
    }
  }
});


const link = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      );
    }
    if (networkError) {
      if ((networkError as any)?.statusCode === UNAUTHORIZED_CODE) {
        window.location.href = `/id?redirectTo=${encodeURIComponent(window.location.href)}`;
      }
      console.error(`[Network error]: ${networkError}`);
    }
  }),
  new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true
    },
    attempts: {
      max: 5,
      retryIf: (error) => !!error
    }
  }),
  createUploadLink({
    uri: `${BASE_PATH}/graphql`,
    credentials: 'include',
    onError: '',
    setOnError: ''
  })
]);


export const client = new ApolloClient({
  link,
  cache
});


