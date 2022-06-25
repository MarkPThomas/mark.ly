import { DataSource } from 'typeorm';

import connectDb from '../connection';
import dbConfig from '../test-config';
import { SampleModel } from '../models';

import sampleModelRepo from './sample-model';
import getTestSampleModel from './mocks/sample-model';

describe('#SampleModel integration specs', () => {
  let client: DataSource;

  beforeAll(async () => {
    client = await connectDb(dbConfig).initialize();
  });

  afterAll(async () => {
    await client.destroy();
  });

  describe('sampleTest', () => {
    const sampleModel: SampleModel = getTestSampleModel();

    beforeAll(async () => {
      await sampleModelRepo().save(sampleModel);
    });

    afterAll(async() => {
      await sampleModelRepo().delete(sampleModel.id);
    });

    it('should fooBar', async () => {
      // const result = await sampleTest().method({});

      //expect(result.).
    });

  });

  describe('#methodName', () => {

  });
});