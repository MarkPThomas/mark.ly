import { AbstractRepository, EntityRepository, FindManyOptions, FindOneOptions, getCustomRepository } from 'typeorm';

import { Account } from '../models';

@EntityRepository(Account)
export class AccountRepository extends AbstractRepository<Account> {
  find(handle: string): Promise<Account | null> {
    return this.repository.findOne(handle);
  }

  save(account: Partial<Account>): Promise<Account> {
    return this.repository.save(account);
  }

  findBy(criteria: FindManyOptions<Account>): Promise<Account[]> {
    return this.repository.find(criteria);
  }

  findOneBy(criteria: FindOneOptions<Account>): Promise<Account | null> {
    return this.repository.findOne(criteria);
  }

  async selectWithLimitAndOffset(
    fields: string,
    criteria: string | null = null,
    limit: number | null = null,
    offset: number | null = null
  ): Promise<Partial<Account>[]> {
    const queryBuilder = this.repository.createQueryBuilder().select(fields);

    if (criteria) queryBuilder.where(criteria);
    if (limit) queryBuilder.limit(limit);
    if (offset) queryBuilder.offset(offset);

    return await queryBuilder.execute();
  }

  lookup(search: string): Promise<Account[]> {
    const LOOKUP_LIMIT = 120;
    const searchTerm = search
      .split(' ')
      .map((i) => i.trim().toLowerCase())
      .join('');

    return this.repository
      .createQueryBuilder()
      .select('handle', 'userHandle')
      .addSelect('first_name', 'firstName')
      .addSelect('last_name', 'lastName')
      .addSelect('email')
      .where('handle = :search', { search })
      .orWhere('lower(first_name) = :searchTerm', { searchTerm })
      .orWhere('lower(last_name) = :searchTerm', { searchTerm })
      .orWhere('lower(first_name || last_name) = :searchTerm', { searchTerm })
      .orWhere('lower(last_name || first_name) = :searchTerm', { searchTerm })
      .orWhere('lower(email) = :searchTerm', { searchTerm })
      .limit(LOOKUP_LIMIT)
      .getRawMany();
  }

  delete(handle: string) {
    return this.repository.delete(handle);
  }
}

export default () => getCustomRepository(AccountRepository);