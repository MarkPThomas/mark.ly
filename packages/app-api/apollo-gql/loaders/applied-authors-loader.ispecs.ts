import { datatype } from 'community-faker';

import { AuthorOpportunityAction, Opportunity } from 'common/database/models';
import { OpportunityStatus } from 'common/enums/opportunity/opportunity-status.enum';
import { AuthorProfileStatuses } from 'common/database/models/Author';

import dbConfig from '../../config';

import authorOpportunityActionRepo from 'common/database/repositories-orm/author-opportunity-action';
import authorRepository from 'common/database/repositories-orm/author';
import opportunityRepo from 'common/database/repositories-orm/opportunity';
import {
  createAuthorOpportunityAction,
  createOpportunity
} from 'common/database/repositories-orm/mocks/opportunity';
import { createUpdatedAuthorMock } from 'common/database/repositories-orm/mocks/author';

import { appliedAuthorsLoader } from './applied-authors-loader';
import createDBConnection from 'common/database/connection';

describe('#appliedAuthorsLoader integration specs', () => {
  let dbConnection;

  const opportunities: Opportunity[] = [
    createOpportunity({ status: OpportunityStatus.OPPORTUNITY_OPEN }),
    createOpportunity({ status: OpportunityStatus.OPPORTUNITY_OPEN }),
    createOpportunity({ status: OpportunityStatus.OPPORTUNITY_OPEN }),
    createOpportunity({ status: OpportunityStatus.OPPORTUNITY_OPEN })
  ];
  const authors = [
    createUpdatedAuthorMock({ status: { status: AuthorProfileStatuses.Published } }),
    createUpdatedAuthorMock({ status: { status: AuthorProfileStatuses.Published } }),
    createUpdatedAuthorMock({ status: { status: AuthorProfileStatuses.Published } })
  ];

  beforeAll(async () => {
    dbConnection = await createDBConnection(dbConfig.db);
    await opportunityRepo().save(opportunities);
    await authorRepository().saveAll(authors);
  });

  afterAll(async () => {
    await opportunityRepo().remove(opportunities);
    await Promise.all(authors.map((item) => authorRepository().delete(item.id)));
    await dbConnection.close();
  });

  describe('#appliedAuthorsLoader', () => {
    let authorOpportunityActions: AuthorOpportunityAction[];

    beforeAll(async () => {
      authorOpportunityActions = await authorOpportunityActionRepo().save([
        createAuthorOpportunityAction({
          authorId: authors[0].id,
          author: authors[0],
          opportunityId: opportunities[0].guid
        }),
        createAuthorOpportunityAction({
          authorId: authors[1].id,
          author: authors[1],
          opportunityId: opportunities[1].guid
        }),
        createAuthorOpportunityAction({
          authorId: authors[2].id,
          author: authors[2],
          opportunityId: opportunities[2].guid
        })
      ]);
    });

    afterAll(async () => {
      await Promise.all(
        authorOpportunityActions.map((item) =>
          authorOpportunityActionRepo().delete({
            authorId: item.authorId,
            opportunityId: item.opportunityId
          })
        )
      );
    });

    it('should return all authors that have applied to a given opportunity', async () => {
      const items = await Promise.all([
        appliedAuthorsLoader.load(opportunities[0].guid),
        appliedAuthorsLoader.load(opportunities[1].guid),
        appliedAuthorsLoader.load(opportunities[2].guid)
      ]);

      items.forEach((appliedAuthor) => {
        const opportunityId = appliedAuthor[0].opportunityId;
        expect(authorOpportunityActions).toEqual(expect.arrayContaining([expect.objectContaining({ opportunityId })]));
      });
      expect(items).toHaveLength(authorOpportunityActions.length);
    });

    it('should return empty array for opportunities that do not exist', async () => {
      const items = await appliedAuthorsLoader.load(datatype.uuid());

      expect(items).toEqual([]);
    });

    it('should return empty array for opportunities that have not authors assigned', async () => {
      const items = await appliedAuthorsLoader.load(opportunities[3].guid);

      expect(items).toEqual([]);
    });
  });
});