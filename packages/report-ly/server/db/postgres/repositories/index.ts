import {
  InsertManyResult,
  Document,
  MongoClient,
  ObjectId,
  WithId,
  InsertOneResult
} from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'weather_ly';

function repo() {
  function loadData(collectionName: string, data): Promise<InsertManyResult<Document>> {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const results = await db.collection(collectionName).insertMany(data);
        resolve(results);
      } catch (error) {
        reject(error);
      } finally {
        client.close();
      }
    });
  }

  function get(collectionName: string, query = {}, controls?): Promise<WithId<Document>[]> {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        let items = db.collection(collectionName).find(query);

        // Note: Apply skip & limit to paginate results
        if (controls?.skip) {
          items = items.skip(controls.skip);
        }
        if (controls?.limit) {
          items = items.limit(controls.limit);
        }

        resolve(await items.toArray());
      } catch (error) {
        reject(error);
      } finally {
        client.close();
      }
    });
  }

  function getById(collectionName: string, id): Promise<Document> {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        let item = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });

        resolve(item);
      } catch (error) {
        reject(error);
      } finally {
        client.close();
      }
    });
  }

  function add(collectionName: string, item): Promise<InsertOneResult<Document>> {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        let addedItem = await db.collection(collectionName).insertOne(item);

        resolve(addedItem);
      } catch (error) {
        reject(error);
      } finally {
        client.close();
      }
    });
  }

  function update(collectionName: string, id, newItem): Promise<WithId<Document>> {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        let updatedItem = await db
          .collection(collectionName)
          .findOneAndReplace({ _id: new ObjectId(id) }, newItem, { returnDocument: 'after' });

        resolve(updatedItem.value);
      } catch (error) {
        reject(error);
      } finally {
        client.close();
      }
    });
  }

  function remove(collectionName: string, id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        let removed = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

        resolve(removed.deletedCount === 1);
      } catch (error) {
        reject(error);
      } finally {
        client.close();
      }
    });
  }

  return {
    loadData,
    get,
    getById,
    add,
    update,
    remove
  };
}

export default repo();