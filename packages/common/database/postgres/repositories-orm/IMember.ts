import { AbstractRepository, FindManyOptions } from 'typeorm';

import { IMember } from '../models/IMember';

export abstract class IMemberRepository<T extends IMember> extends AbstractRepository<IMember> {
  find(id: string): Promise<IMember | undefined> {
    return this.repository.findOne(id);
  }

  findOneByMemberSlug(slug: string) {
    return this.repository.findOne({ where: { slug: slug } });
  }

  save(member: Partial<T>) {
    return this.repository.save(member);
  }

  saveAll(members: T[]): Promise<T[]> {
    return this.repository.save(members);
  }

  findAndCount(conditions: FindManyOptions<IMember>) {
    return this.repository.findAndCount(conditions);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }


  totalCount(): Promise<number> {
    return this.repository.count();
  }


  findAllByIds(ids: string[]) {
    return this.repository.findByIds(ids);
  }


  protected baseSelectAllQuery() {
    return this.repository
      .createQueryBuilder('a')
      .select('a.id', 'id')
      .addSelect('user_handle', 'userHandle')
      .addSelect('a.first_name', 'firstName')
      .addSelect('a.last_name', 'lastName')
      .addSelect(
        `case when display_name is null or trim(display_name) = '' then concat(a.first_name, ' ', a.last_name) else display_name end`,
        'displayName'
      )
      .addSelect('email')
      .addSelect('bio')
      .addSelect('short_bio', 'shortBio')
      .addSelect('image')
      .addSelect('social')
      .addSelect('a.status', 'status')
      .addSelect('slug')
      .addSelect('badge')
      .addSelect('a.type', 'type')
      .addSelect('last_modified_at', 'lastModifiedAt')
      .addSelect('last_published_at', 'lastPublishedAt')
      .addSelect('a.created_at', 'createdAt');
  }
}