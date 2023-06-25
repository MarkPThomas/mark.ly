import { datatype, name, date, internet, lorem } from 'community-faker';

import { Account } from '../../models';

export default (replace?: { [key: string]: any }): Account => ({
  handle: 'test-handle',
  firstName: name.firstName(),
  lastName: name.lastName(),
  username: 'test-username',
  email: datatype.uuid() + '@test.com',
  timeToLive: date.future(),
  gravatarUrl: internet.url(),
  personas: [lorem.word()],
  accountClosed: false,
  accountRemoved: false,
  ...replace
});