// module.exports.camData = require('../data/cams.json');
// module.exports.ropeData = require('../data/ropes.json');

// export routeData from '../../data/routes.json';

// module.exports.rackData = require('../data/racks.json');

console.log('Initializing DB');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rack_ly',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
);

// // ===== Schemas/Models =====
// //  ========= Gear =========
const camItemSchema = mongoose.Schema({
  size: { type: String, required: true },
  color: String,
  minRange: Number,
  minRangeUnit: String,
  maxRange: Number,
  maxRangeUnit: String,
  weight: Number,
  weightUnit: String
});
const CamItem = mongoose.model('CamItem', camItemSchema);

const camsSchema = mongoose.Schema({
  manufacturer: { type: String, required: true },
  models: [
    {
      modelName: { type: String, required: true },
      lines: [
        {
          lineName: { type: String, required: true },
          cams: [camItemSchema]
        }
      ]
    }
  ]
});
const Cam = mongoose.model('Cam', camsSchema);

const ropeSchema = mongoose.Schema({
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  dryTreated: Boolean,
  diameter: Number,
  diameterUnit: String,
  length: Number,
  lengthUnit: String,
  weight: Number,
  weightUnit: String
});
const Rope = mongoose.model('Rope', ropeSchema);

const rackSchema = mongoose.Schema({
  cams: [
    {
      manufacturer: { type: String, required: true },
      modelName: { type: String, required: true },
      lineName: { type: String, required: true },
      size: { type: String, required: true },
      quantity: Number,
      quantityMax: Number, // optional
      isOptional: Boolean // optional
    }
  ]
});
const Rack = mongoose.model('Rack', rackSchema);


// const rackItemSchema = mongoose.Schema({
//   itemId: Number,
//   quantity: Number
// });
// const RackItem = mongoose.model('RackItem', rackItemSchema);

const userRackSchema = mongoose.Schema({
  userIds: [String],
  expiration: Date,
  rack: rackSchema
});
const UserRack = mongoose.model('UserRack', userRackSchema);

// //  ========= Route =========
const routeSchema = mongoose.Schema({
  areaName: { type: String, required: true },
  cragName: { type: String, required: true },
  routeName: { type: String, required: true },
  pitches: [
    {
      pitch: Number, // if null, taken to be the entire climb
      rating: String,
      length: Number,
      lengthUnit: String,
      rack: rackSchema
    }
  ]
});
const Route = mongoose.model('Route', routeSchema);
//consider schema method to compile total pitches, total length, total rack

// ===== DB Write Methods =====
export class DB {

  static addCams = cams => {
    return Cam.insertMany(cams);
  };

  //TODO: Finish
  static addCamSeries = (cams, model, manufacturer) => {
    return Cam.insertMany(cams);
  };

  // TODO: Finish
  static addCam = (cams, model, manufacturer) => {
    return Cam.insertOne(cams);
  };

  static getCams = () => {
    return Cam.find({});
  };



  static addRopes = ropes => {
    return Rope.insertMany(ropes);
  };

  static getRopes = () => {
    return Rope.find({});
  };



  static addRoutes = routes => {
    return Route.insertMany(routes);
  };

  // TODO: Finish
  static getAreas = () => {
    return Route.find({});
  };

  // TODO: Finish
  static getCrags = () => {
    return Route.find({});
  };

  // TODO: Finish
  static getRoutes = () => {
    return Route.find({}).sort({ areaName: 'asc' }).sort({ cragName: 'asc' }).sort({ routeName: 'asc' });
  };
}