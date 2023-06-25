import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { UserClaims } from '../models';

@EntityRepository(UserClaims)
export class UserClaimsRepository extends Repository<UserClaims> { }

export default () => getCustomRepository(UserClaimsRepository);