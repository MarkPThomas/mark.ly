import { ApolloProvider } from '@apollo/client';
import AppComponent from 'app';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'react-router-dom';

import { client } from './api/graphql/client';
import { ErrorBoundary } from './shared/components/ErrorBoundary';


import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container);


declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DeprecatedLifecycle<P, S> {
    context: any;
  }
}

const testUser = window.location?.href.includes('localhost')
  ? {
    fullName: 'Mr Wombato',
    avatarUrl: 'https://fakeWebsite.imgix.net/member/default.jpg',
    type: 'member'
  }
  : undefined;

const AppBody = () => {
  return (
    <ApolloProvider client={client}>
      <ErrorBoundary>
        <AppComponent />
      </ErrorBoundary>
    </ApolloProvider>
  );
};

const Index = () => {
  return (
    <Router history={history as any}>
      {/* <NavApp testUser={testUser}> */}
      <AppBody />
      {/* </NavApp> */}
    </Router>
  );
};

root.render(<Index />);