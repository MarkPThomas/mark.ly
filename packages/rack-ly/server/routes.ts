const router = require('express').Router();
import { DB } from './database';
import { IArea, ICrag } from './model';

// router.get('/', (req, res) => {
//   console.log('Getting home page!');
//   res.status(200);
// });

router.get('/cams', (req, res) => {
  console.log('Getting cams from database...');
  // db.addCams(db.camData)
  // .then(data => {
  DB.getCams()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send('No cams found!')
    });
  //   }
  // );
});


// router.post('/cams', (req, res) => {
//   db.addCams()
//     .then(data => {
//       res.status(200).send(data);
//     })
//     .catch(error => {
//       console.log(error);
//       res.status(404).send('No cams found!')
//     });
// });

router.get('/ropes', (req, res) => {
  DB.getRopes()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send('No ropes found!')
    });
});

// gets list of all routes
router.get('/routes', (req, res) => {
  console.log('Getting routes from database...');
  // db.addRoutes(db.routeData)
  // .then(data => {
  DB.getRoutes()
    .then(data => {
      // Organize data for client
      const routesGrouped = {
        areas: []
      };

      const areaNames = {};
      const cragNames = {};
      data.forEach(route => {
        const areaName = route.areaName;
        let areaObject: IArea;
        if (areaNames[areaName]) {
          areaObject = routesGrouped.areas.find(area => {
            return area.areaName === areaName;
          });
        } else {
          areaNames[areaName] = true;
          areaObject = {
            areaName: areaName,
            id: route._id,
            crags: []
          };
          routesGrouped.areas.push(areaObject);
        }

        const cragName: string = route.cragName;
        const areaCragName = `${areaName} - ${cragName}`;
        let cragObject: ICrag;
        if (cragNames[areaCragName]) {
          cragObject = areaObject.crags.find(crag => {
            return crag.cragName === cragName;
          });
        } else {
          cragNames[areaCragName] = true;
          cragObject = {
            cragName: cragName,
            id: route._id,
            routes: []
          };
          areaObject.crags.push(cragObject);
        }

        let routeObject = {
          id: route._id,
          routeName: route.routeName,
          rating: route.pitches[0].rating,
          length: route.pitches[0].length,
          lengthUnit: route.pitches[0].lengthUnit,
          pitches: route.pitches
        };

        // Sort rack
        routeObject.pitches.forEach(pitch => {
          pitch.rack.cams.sort((a, b) => { return a[1] - b[1]; });
        });

        cragObject.routes.push(routeObject);
      });

      console.log(`Found ${data.length} routes`);
      res.status(200).send(routesGrouped);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send('No routes found!')
    });
  //   }
  // );
});

// gets list of all crags in an area
router.get('/crags/:areaId', (req, res) => {
  DB.getCrags(areaId)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send('No routes found!')
    });
});

// gets route object data for all routes in a crag
router.get('/routes/:cragId', (req, res) => {
  DB.getPitches(cragId)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(error => {
      console.log(error);
      res.status(404).send('No routes found!')
    });
});

router.get('/rack/:route', (req, res) => {
  // Get the rack needed for a route:
  //    If no req.userRack supplied, return as a C4 rack
  //    If rack supplied, return filtered rack after checking against C4 sizes
  //        If quantity in rack is insufficient, return models w/ quantity needed
  //        If size in rack is missing, return C4 size & quantity
  //            In later dev, allow user to specify what brand of cams to show shortage in
});

// router.post('/rack/:route', (req, res) => {
//   // Convert rack to BD C4 rack
// });

router.get('/rack', (req, res) => {
  // req has:
  //  user rack
  //  user list of routes (by id)
  // generate report for user:
  //    equivalent of GET /rack/:route for all routes listed, compiled into a list by route & total set of routes
});

module.exports = router;