import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { AccessToken } from '../models';

@EntityRepository(AccessToken)
export class AccessTokenRepository extends Repository<AccessToken> { }

export default () => getCustomRepository(AccessTokenRepository);