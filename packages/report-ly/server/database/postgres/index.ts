import { Client } from 'pg';
import Repo from './repositories';

const client = new Client({
  host: '127.0.0.1',
  user: 'postgres',
  database: 'report_ly',
  password: 'password',
  port: 5432
});

export class Connection {

}

export async function getConnection() {
  try {
    await client.connect();
    await client.query();//query string
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  } finally {
    await client.end();
  }
}