import {
  EntityRepository,
  getCustomRepository,
  FindOneOptions,
} from 'typeorm';


import { IMemberBadge, IMemberImage, IMemberSocial, IMemberStatus } from '../../interfaces/IMemberInterfaces';
import { Member } from '../models';


import { IMemberRepository } from './IMember';

export interface IMemberSelfHealing {
  id: string;
  userHandle: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string | null;
  bio: string | null;
  shortBio: string | null;
  slug: string;
  image: IMemberImage;
  social: IMemberSocial;
  status: IMemberStatus;
  badge: IMemberBadge;
  lastModifiedAt: Date;
  lastPublishedAt: Date;
  createdAt: Date;
  type: string;
}


@EntityRepository(Member)
export class MemberRepository extends IMemberRepository<Member> {
  findBy(where: FindOneOptions<Member>): Promise<(Member & { changeLogs?: any }) | undefined> {
    return this.repository.findOne(where);
  }
}


export default () => getCustomRepository(MemberRepository);


