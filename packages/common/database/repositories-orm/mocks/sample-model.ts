import { datatype } from 'community-faker';

import { SampleModel } from '../../models';

export default (replace?: { [key: string]: any }): SampleModel => ({
  id: datatype.uuid(),
  ...replace
});