import React from 'react';

import './App.css';
import { Menu } from './components/Menu';
import { Home } from './components/Home';
import { BuildRack } from './components/BuildRack';
import { CreateRoute } from './components/CreateRoute';
import { AddRoute } from './components/AddRoute';

// import RopeList from './components/rack/ropes/RopeList';

export class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('Starting app!');
    this.pages = [
      'home',
      'buildRack',
      'addRoute',
      // 'createRoute'
    ];

    this.state = {
      currentPage: '',
      user: {
        userName: "Guest",
        routes: [],
        rack: {
          cams: [],
          ropes: []
        },
        rackNeeded: {
          cams: [],
          ropes: []
        },
        rackShort: {
          cams: [],
          ropes: []
        }
      }
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.handleRackChange = this.handleRackChange.bind(this);
    this.getRackNeeded = this.getRackNeeded.bind(this);
    this.getRackShort = this.getRackShort.bind(this);
    this.camsAreEqual = this.camsAreEqual.bind(this);
    this.camsSortByMinRange = this.camsSortByMinRange.bind(this);
  }

  componentDidMount() {
    this.setState({
      currentPage: this.pages[0]
    })
  }

  handleMenuClick(pageName) {
    console.log('User menu clicked:', pageName);
    this.setState({
      currentPage: pageName
    })
  }

  camsAreEqual(cam1, cam2) {
    // TODO: Add manufacturer & line to cams to use in match below
    return (cam1.size === cam2.size);
  }

  camsSortByMinRange(cams) {
    cams.sort((a, b) => a.minRange - b.minRange);
  }

  getRackNeeded(routes) {
    const rackNeeded = {
      cams: [],
      ropes: []
    };
    console.log('Routes', routes);
    routes.forEach(route => {
      // Cams
      console.log('route.pitches[0].rack', route.pitches[0].rack);

      let camsForRoute = route.pitches[0].rack.cams;
      console.log('cams', camsForRoute);
      const camsNeeded = rackNeeded.cams;
      console.log('camsNeeded', camsNeeded);
      for (let i = 0; i < camsForRoute.length; i++) {
        let camForRoute = camsForRoute[i];
        const isInSet = (index) => { return (index !== -1) };

        const index = camsNeeded.findIndex((camNeeded) => { return (this.camsAreEqual(camNeeded, camForRoute)); });
        console.log(index);
        if (isInSet(index)) {
          let currentCam = camsNeeded[i];
          if (currentCam.quantity < camForRoute.quantity) {
            camsNeeded[i] = camForRoute;
          }
          // else if (updatedComponent.quantity === 0) {
          //   camsNeeded.splice(index, 1);
          // }
        } else {
          camsNeeded.push(camForRoute);
        }
      }
      this.camsSortByMinRange(camsNeeded);

      // Ropes: TODO
    });
    return rackNeeded;
  }

  getRackShort(rackAvailable, rackNeeded) {
    const rackShort = {
      cams: [],
      ropes: []
    };

    // Cams
    const camsNeeded = rackNeeded.cams;
    const camsAvailable = rackAvailable.cams;
    for (let i = 0; i < camsNeeded.length; i++) {
      const camNeeded = camsNeeded[i];
      let camShort = {
        "_id": camNeeded._id,
        "manufacturer": camNeeded.manufacturer,
        "modelName": camNeeded.modelName,
        "lineName": camNeeded.lineName,
        "size": camNeeded.size,
        "color": camNeeded.color,
        "minRange": camNeeded.minRange,
        "minRangeUnit": camNeeded.minRangeUnit,
        "maxRange": camNeeded.maxRange,
        "maxRangeUnit": camNeeded.maxRangeUnit,
        "weight": camNeeded.weight,
        "weightUnit": camNeeded.weightUnit,
        "quantity": camNeeded.quantity
      };

      let camFound = false;
      for (let j = 0; j < camsAvailable.length; j++) {
        const camAvailable = camsAvailable[j];
        if (this.camsAreEqual(camAvailable.size, camNeeded.size)) {
          camFound = true;
          const quantityShort = camNeeded.quantity - camAvailable.quantity;
          if (quantityShort > 0) {
            camShort.quantity = quantityShort;
            rackShort.cams.push(camShort);
          }
          break;
        }
      }
      if (!camFound) {
        rackShort.cams.push(camShort);
      }
    }
    this.camsSortByMinRange(rackShort.cams);
    // Ropes: TODO

    return rackShort;
  }

  handleRouteChange(route) {
    console.log('Updating Route:', route)
    const user = this.state.user;
    if (route.isSelected) {
      user.routes.push(route);
    } else {
      const index = user.routes.findIndex(userRoute => userRoute.id === route.id);
      user.routes.splice(index, 1);
    }
    user.rackNeeded = this.getRackNeeded(user.routes);
    user.rackShort = this.getRackShort(user.rack, user.rackNeeded);
    this.setState({
      user: user
    })
    console.log('Updated user routes:', this.state.user.routes);
  }

  handleRackChange(rack) {
    const user = this.state.user;
    user.rack = rack;
    this.camsSortByMinRange(user.rack.cams);

    console.log('handleRackChange');
    user.rackShort = this.getRackShort(user.rack, user.rackNeeded);
    this.setState({
      user: user
    })
    console.log('Updated user rack:', this.state.user.rack);
  }


  // render() {
  //   console.log('Rendering app!');
  //   const menuItems = [];
  //   let counter = 1;
  //   this.pages.forEach(page => {
  //     menuItems.push({id: counter, title: page});
  //     counter++;
  //   });
  //   // menuItems.push({id: counter++, title: "ropeList"})

  //   return (
  //     <div>
  //       <Menu onMenuClick={this.handleMenuClick} menuItems={menuItems} />
  //       <h1>Rack.ly</h1>
  //       {this.state.currentPage === this.pages[0] &&
  //         <Home user={this.state.user} />
  //       }
  //       {this.state.currentPage === this.pages[1] &&
  //         <BuildRack user={this.state.user} onRackChange={this.handleRackChange} />
  //       }
  //       {this.state.currentPage === this.pages[2] &&
  //         <AddRoute user={this.state.user} onRouteChange={this.handleRouteChange} />
  //       }
  //       {this.state.currentPage === this.pages[3] &&
  //         <CreateRoute />
  //       }
  //       {/*
  //       {this.state.currentPage === "ropeList" &&
  //         <RopeList />
  //       } */}
  //     </div>
  //   );
  // }
}