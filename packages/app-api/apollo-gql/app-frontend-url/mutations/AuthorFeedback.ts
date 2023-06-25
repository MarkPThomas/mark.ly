import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { Context } from 'koa';


import logger from '../../../logger';
import {
  applyBatchFeedbackAction as applyBatchFeedbackActionResolver,
  applyFeedbackAction as applyFeedbackActionResolver,
  undoBatchFeedbackAction as undoBatchFeedbackActionResolver,
  undoFeedbackAction as undoFeedbackActionResolver
} from '../../resolvers/feedback/author-feedback-actions';
import { FeedbackAction } from '../../resolvers/feedback/feedback-actions/services/feedback-action.interface';
import { AuthorFeedbackData } from '../../types/AuthorFeedback';


interface MutateFeedbackActionArgs {
  feedbackId: string;
  action: string;
  contentType: string;
}


interface MutateBatchFeedbackActionArgs {
  feedbackIds: string[];
  action: string;
  contentType: string;
}


const AuthorFeedbackAction = new GraphQLEnumType({
  name: 'AuthorFeedbackAction',
  values: {
    READ: {
      value: 'read'
    },
    BOOKMARK: {
      value: 'bookmark'
    },
    DELETE: {
      value: 'delete'
    }
  }
});


export const applyFeedbackAction = {
  name: 'applyFeedbackAction',
  type: AuthorFeedbackData,
  args: {
    feedbackId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    action: {
      type: new GraphQLNonNull(AuthorFeedbackAction)
    },
    contentType: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: async (root: unknown, args: MutateFeedbackActionArgs, ctx: Context): Promise<FeedbackAction> => {
    const authorId = ctx.state.authorId;


    logger.info({
      layer: 'SERVICE',
      message: `GraphQL mutation applyFeedbackAction; With requestId ${ctx.state.requestId}`,
      payload: {
        authorId,
        args: args
      }
    });


    const params = {
      authorId,
      feedbackId: args.feedbackId,
      contentType: args.contentType
    };


    return applyFeedbackActionResolver(params, args.action);
  }
};


export const applyBatchFeedbackAction = {
  name: 'applyBatchFeedbackAction',
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AuthorFeedbackData))),
  args: {
    feedbackIds: {
      type: new GraphQLList(GraphQLString)
    },
    action: {
      type: new GraphQLNonNull(AuthorFeedbackAction)
    },
    contentType: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: async (root: unknown, args: MutateBatchFeedbackActionArgs, ctx: Context): Promise<FeedbackAction[]> => {
    const authorId = ctx.state.authorId;


    logger.info({
      layer: 'SERVICE',
      message: `GraphQL mutation applyBatchFeedbackAction; With requestId ${ctx.state.requestId}`,
      payload: {
        authorId,
        args: args
      }
    });


    return applyBatchFeedbackActionResolver(authorId, args.feedbackIds, args.contentType, args.action);
  }
};


export const undoFeedbackAction = {
  name: 'undoFeedbackAction',
  type: AuthorFeedbackData,
  args: {
    feedbackId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    action: {
      type: new GraphQLNonNull(AuthorFeedbackAction)
    },
    contentType: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: async (root: unknown, args: MutateFeedbackActionArgs, ctx: Context): Promise<FeedbackAction> => {
    const authorId = ctx.state.authorId;


    logger.info({
      layer: 'SERVICE',
      message: `GraphQL mutation undoFeedbackAction; With requestId ${ctx.state.requestId}`,
      payload: {
        authorId,
        args: args
      }
    });


    const params = {
      authorId,
      feedbackId: args.feedbackId,
      contentType: args.contentType
    };


    return undoFeedbackActionResolver(params, args.action);
  }
};


export const undoBatchFeedbackAction = {
  name: 'undoBatchFeedbackAction',
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AuthorFeedbackData))),
  args: {
    feedbackIds: {
      type: new GraphQLList(GraphQLString)
    },
    action: {
      type: new GraphQLNonNull(AuthorFeedbackAction)
    },
    contentType: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: async (root: unknown, args: MutateBatchFeedbackActionArgs, ctx: Context): Promise<FeedbackAction[]> => {
    const authorId = ctx.state.authorId;


    logger.info({
      layer: 'SERVICE',
      message: `GraphQL mutation undoBatchFeedbackAction; With requestId ${ctx.state.requestId}`,
      payload: {
        authorId,
        args: args
      }
    });


    return undoBatchFeedbackActionResolver(authorId, args.feedbackIds, args.contentType, args.action);
  }
};


