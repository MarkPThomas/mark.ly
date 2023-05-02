import { Connection, getConnection } from '..';
import { fooBar } from '../../../interfaces';

export class TripReportsRepository {
  private connection: Connection;

  constructor() {
    this.connection = getConnection();
  }

  async getFooBar(params: {}): Promise<fooBar[]> {
    return this.connection.query(
      ``,
      [] // arguments for $1, $2 params etc.
    );
  }
}