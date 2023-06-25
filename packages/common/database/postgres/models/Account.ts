import { Column, Entity, Index } from 'typeorm';

@Index('account_pkey', ['handle'], { unique: true })
@Entity('account', { schema: 'public' })
export class Account {
  @Column('text', { primary: true, name: 'handle' })
  handle: string;

  @Column('text', { name: 'first_name' })
  firstName: string;

  @Column('text', { name: 'last_name' })
  lastName: string;

  @Column('text', { name: 'username', nullable: true })
  username: string | null;

  @Column('text', { name: 'gravatar_url', nullable: true })
  gravatarUrl: string | null;

  @Column('text', { name: 'email', nullable: true })
  email: string | null;

  @Column('boolean', { name: 'account_closed', nullable: true })
  accountClosed: boolean | null;

  @Column('boolean', { name: 'account_removed', nullable: true })
  accountRemoved: boolean | null;

  @Column('jsonb', { name: 'personas', nullable: true })
  personas: object | null;

  @Column('timestamp with time zone', { name: 'time_to_live', nullable: true })
  timeToLive: Date | null;
}