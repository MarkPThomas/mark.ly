import { Column, Entity, Index } from 'typeorm';

@Index('sample_model_pkey', ['id'], { unique: true })
@Entity('sample_model', { schema: 'public '})
export class SampleModel {
  @Column('text', { primary: true, name: 'id'})
  id: string;
}