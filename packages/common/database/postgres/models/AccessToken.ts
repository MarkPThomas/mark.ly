import { Column, Entity, Index, OneToMany } from 'typeorm';

import { AccessTokenUsageLog } from './AccessTokenUsageLog';

@Index('access_token_pkey', ['token'], { unique: true })
@Entity('access_token', { schema: 'public' })
export class AccessToken {
  @Column('text', { primary: true, name: 'token' })
  token: string;

  @Column('text', { name: 'client' })
  client: string;

  @Column('text', { name: 'issued_by' })
  issuedBy: string;

  @Column('timestamp without time zone', { name: 'created_date' })
  createdDate: Date;

  @OneToMany(() => AccessTokenUsageLog, (accessTokenLog: AccessTokenUsageLog) => accessTokenLog.accessToken)
  accessTokenLogs?: AccessTokenUsageLog[];
}