import { Column, Entity, Index } from 'typeorm';

@Index('user_claims_pkey', ['handle'], { unique: true })
@Entity('user_claims', { schema: 'public' })
export class UserClaims {
  @Column('text', { primary: true, name: 'handle' })
  handle: string;

  @Column('jsonb', { name: 'claims' })
  claims: string[];

  @Column('timestamp with time zone', { name: 'time_to_live' })
  timeToLive: Date;
}