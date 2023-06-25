import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AccessToken } from './AccessToken';

@Index('access_token_usage_log_pkey', ['id'], { unique: true })
@Entity('access_token_usage_log', { schema: 'public' })
export class AccessTokenUsageLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccessToken, (accessToken) => accessToken.accessTokenLogs)
  @JoinColumn({ name: 'token', referencedColumnName: 'token' })
  accessToken: AccessToken;

  @Column('text', { name: 'token' })
  token: string;

  @Column('text', { name: 'resource' })
  resource: string;

  @Column('jsonb', { name: 'payload', nullable: true })
  payload?: object | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdDate: Date;
}