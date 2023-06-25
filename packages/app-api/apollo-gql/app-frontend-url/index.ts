import { ApolloServer } from 'apollo-server-koa';
import Koa from 'koa';
import compose from 'koa-compose';
import mount from 'koa-mount';


import logger from '../../logger';
import { graphQLErrorLogger } from '../../middleware/gql-error-logger';


import schema from './schema';


const apolloServer = new ApolloServer({
  schema,
  formatError: graphQLErrorLogger(logger),
  context: (req: Koa.Context) => req.ctx,
  introspection: false
});


export const mountAppFrontendUrlGQL = async (app: Koa, path: string): Promise<void> => {
  const middleware = mount(path, compose([]));


  app.use(middleware);


  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path });
};


