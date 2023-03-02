import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar/Navbar';
import Drivers from './containers/Drivers/Drivers';
import Constructors from './containers/Constructors/Constructors';
import Races from './containers/Races/Races';
import DriverDetails from './components/DriverDetails/DriverDetails';
import ConstructorDetails from './components/ConstructorDetails/ConstructorDetails';
import RaceDetails from './components/RaceDetails/RaceDetails';
import Welcome from './containers/Welcome/Welcome';

class App extends Component {
  state = {
    year: 2022,
  };

  yearHandler = (year) => {
    this.setState({ year }, () => this.props.history.push(`/drivers?year=${year}`));
  };

  render() {
    return (
      <div className='App'>
        <Navbar year={this.state.year} />
        <div className='main'>
          <div className='wrapper'>
            <Switch>
              <Route path='/drivers/:id' component={DriverDetails} />
              <Route path='/drivers' component={() => <Drivers yearHandler={this.yearHandler} />} />
              <Route path='/constructors/:id' component={ConstructorDetails} />
              <Route
                path='/constructors'
                component={() => <Constructors yearHandler={this.yearHandler} />}
              />
              <Route path='/races/:id' component={RaceDetails} />
              <Route path='/races' component={() => <Races yearHandler={this.yearHandler} />} />
              <Route
                path='/'
                component={() => <Welcome year={this.state.year} yearHandler={this.yearHandler} />}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
