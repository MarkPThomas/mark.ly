import { Column } from 'typeorm';

import {
  IMemberBadge,
  IMemberImage,
  IMemberPersonal,
  IMemberSocial,
  IMemberStatus
} from '../../interfaces/IMemberInterfaces';

export enum MEMBER_STATUSES {
  hidden = 'hidden',
  published = 'published',
  removed = 'removed',
  deleted = 'deleted'
}


export enum MEMBER_TYPES {
  moderator = 'moderator',
  contributer = 'contributer',
  viewer = 'viewer'
}


export abstract class IMember {
  @Column('text', { primary: true, name: 'id' })
  id: string;


  @Column('text', { name: 'user_handle', nullable: true })
  userHandle: string | null;


  @Column('text', { name: 'first_name', nullable: false })
  firstName: string;


  @Column('text', { name: 'last_name', nullable: false })
  lastName: string;


  @Column('text', { name: 'display_name', nullable: false })
  displayName: string;


  @Column('text', { name: 'email', nullable: false })
  email: string;


  @Column('text', { name: 'bio', nullable: true })
  bio: string | null;


  @Column('text', { name: 'short_bio', nullable: true })
  shortBio: string | null;


  @Column('text', { name: 'type', nullable: false })
  type: string;


  @Column('jsonb', { name: 'image', nullable: false })
  image: IMemberImage;


  @Column('jsonb', { name: 'social', nullable: false })
  social: IMemberSocial;


  @Column('jsonb', { name: 'personal', nullable: true })
  personal: IMemberPersonal;


  @Column('jsonb', { name: 'badge', nullable: false })
  badge: IMemberBadge;


  @Column('jsonb', { name: 'status', nullable: false })
  status: IMemberStatus;


  @Column('timestamp without time zone', {
    name: 'last_modified_at',
    nullable: true
  })
  lastModifiedAt: Date | null;


  @Column('timestamp without time zone', {
    name: 'last_published_at',
    nullable: true
  })
  lastPublishedAt: Date | null;


  @Column('timestamp without time zone', { name: 'created_at' })
  createdAt: Date;


  @Column('text', { name: 'slug', nullable: false })
  slug: string;


  @Column('text', { name: 'phone', nullable: true })
  phone: string | null;
}