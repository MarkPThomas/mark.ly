import { Column, Entity, Index } from 'typeorm';

import { IMember } from './IMember';

export enum AuthorProfileStatuses {
  Published = 'published',
  Hidden = 'hidden',
  Removed = 'removed'
}

@Index('member_id_user_handle_author_handle_i', ['id', 'userHandle'], { unique: true })
@Index('member_search_idx', ['userHandle', 'firstName', 'lastName', 'email'])
@Index('member_pkey', ['id'], { unique: true })
@Index('member_slug_idx', ['slug'], { unique: true })
@Entity('member', { schema: 'public' })
export class Member extends IMember {

}