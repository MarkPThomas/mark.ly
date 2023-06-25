import authorOpportunityActionRepo from 'common/database/repositories-orm/author-opportunity-action';
import DataLoader from 'dataloader';

async function getAppliedAuthors(opportunityGuids: string[]) {
  const appliedAuthors = await authorOpportunityActionRepo().getAppliedAuthorsByOpportunityIds(opportunityGuids);

  return opportunityGuids.map((guid) => appliedAuthors.filter((author) => author.opportunityId === guid));
}

export const appliedAuthorsLoader = new DataLoader(getAppliedAuthors, { cache: false });