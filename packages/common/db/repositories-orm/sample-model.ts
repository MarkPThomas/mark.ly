import {
  AbstractRepository,
  EntityRepository,
  getCustomRepository
} from 'typeorm';

import { SampleModel } from '../models';

@EntityRepository(SampleModel)
export class SampleModelRepository extends AbstractRepository<SampleModel> {
  // additional functions/method overwrites may be defined here
  save(sampleModel: SampleModel) {
    return this.repository.save(sampleModel);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}

export default () => getCustomRepository(SampleModelRepository);