import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import './Drivers.css';
import Loader from '../../components/Loader/Loader';
import { constructorDetailsHandler, driverDetailsHandler, driversFilter } from '../../helper';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import YearPicker from '../../components/YearPicker/YearPicker';

export class Drivers extends Component {
  state = {
    driverStandings: [],
    year: null,
    query: '',
    loading: true,
  };
  com;

  componentDidMount() {
    const year = new URLSearchParams(this.props.location.search).get('year');
    this.setState(
      {
        year,
      },
      () => {
        this.fetchDrivers();
      }
    );
  }

  fetchDrivers = () => {
    axios.get(`http://ergast.com/api/f1/${this.state.year}/driverStandings.json`).then((res) => {
      this.setState({
        driverStandings: res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings,
        loading: false,
      });
    });
  };

  searchHandler = (event) => {
    const query = event.target.value;
    this.setState({
      query: query,
    });
  };

  yearHandler = (event) => {
    this.props.yearHandler(event.target.value);
    this.setState(
      {
        loading: true,
      },
      () => this.fetchDrivers()
    );
  };

  render() {
    const { driverStandings, year, query, loading } = this.state;
    const standings = driversFilter(driverStandings, query);

    if (loading) return <Loader />;
    const driversTable = (
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Driver</th>
            <th>Nationality</th>
            <th>Team</th>
            <th>Wins</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings &&
            standings.map((result) => (
              <tr key={result.position}>
                <td>{result.position}</td>
                <td
                  className='cursor'
                  onClick={() => driverDetailsHandler(this.props, result.Driver.driverId, year)}
                >
                  {result.Driver.givenName + ' ' + result.Driver.familyName}
                </td>
                <td>{result.Driver.nationality}</td>
                <td
                  className='cursor'
                  onClick={() =>
                    constructorDetailsHandler(
                      this.props,
                      result.Constructors[0].constructorId,
                      year
                    )
                  }
                >
                  {result.Constructors[0].name}
                </td>
                <td>{result.wins}</td>
                <td>{result.points}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );

    return (
      <div className='container'>
        <Breadcrumb year={this.state.year} elements={['drivers']} />
        <div className='header'>
          <h1 className='title'>
            <YearPicker year={year} onChange={this.yearHandler} /> Driver Standings
          </h1>

          <input
            className='navbar-search'
            type='text'
            value={query}
            placeholder='Search...'
            onChange={(event) => this.searchHandler(event)}
          />
        </div>
        {driversTable}
      </div>
    );
  }
}

export default withRouter(Drivers);
