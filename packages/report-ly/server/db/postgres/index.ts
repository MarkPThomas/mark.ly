import assert from 'assert';
import { MongoClient } from 'mongodb';
import Repo from './repositories';
import pointsData from '../../data/weather_ly.points.json';
import gridsData from '../../data/weather_ly.grids.json';

const url = 'mongodb://localhost:27017';
const dbName = 'report_ly';

public static $blogCategories = [
  'trip-reports' => 'Trip Reports',
  'articles' => 'Articles'
];

public static $reportCategories = [
  'alaska' => 'Alaska',
  'california' => 'California',
  'canada' => 'Canada',
  'colorado' => 'Colorado',
  'idaho' => 'Idaho',
  'utah' => 'Utah',
  'washington' => 'Washington',
  'wyoming' => 'Wyoming'
];

export default async function connectDB() {
  const client = new MongoClient(url);
  try {
    await client.connect();

    const pointsCollectionName = 'points';
    const resultsPoints = await Repo.loadData(pointsCollectionName, pointsData);
    assert.equal(pointsData.length, resultsPoints.insertedCount);

    const gridsCollectionName = 'grids';
    const resultsGrids = await Repo.loadData(gridsCollectionName, gridsData);
    assert.equal(gridsData.length, resultsGrids.insertedCount);

    // Basic tests
    console.log('Getting points...');
    const getPointsData = await Repo.get(pointsCollectionName);
    assert.equal(pointsData.length, getPointsData.length);

    console.log('Getting point by name...');
    const filterPointsData = await Repo.get(pointsCollectionName, { name: getPointsData[1].name });
    assert.deepEqual(filterPointsData[0], getPointsData[1]);

    console.log('Getting points by ID...');
    const getPointsById = await Repo.getById(pointsCollectionName, getPointsData[1]._id);
    assert.deepEqual(getPointsById, getPointsData[1]);

    console.log('Inserting item...');
    const newItem =
    {
      "name": "Longish Pk",
      "latitude": 39.5883597956832,
      "longitude": -105.6434294488281,
      "gridId": ""
    }
    const addedItem = await Repo.add(pointsCollectionName, newItem);
    assert(addedItem.insertedId);
    const getAddedItem = await Repo.getById(pointsCollectionName, addedItem.insertedId);
    assert.deepEqual(newItem, getAddedItem);

    console.log('Updating item...');
    const updatedItem =
    {
      "name": "Even More Longish Pk",
      "latitude": 39.5883597956832,
      "longitude": -105.6434294488281,
      "gridId": ""
    }
    const newlyUpdatedItem = await Repo.update(pointsCollectionName, addedItem.insertedId, updatedItem);
    assert.equal(updatedItem.name, newlyUpdatedItem.name);

    const removedItem = await Repo.remove(pointsCollectionName, addedItem.insertedId);
    assert(removedItem);
    const getRemovedItem = await Repo.getById(pointsCollectionName, addedItem.insertedId);
    assert.equal(getRemovedItem, null);
  } catch (error) {
    console.log(error);
  } finally {
    const admin = client.db(dbName).admin();

    console.log(await admin.listDatabases());
    console.log(`Dropping database ${dbName}...`);
    await client.db(dbName).dropDatabase();
    console.log(await admin.listDatabases());

    client.close();
  }
}