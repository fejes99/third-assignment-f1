import React, { Component } from 'react';
import axios from 'axios';

import './Races.css';
import {
  getFormattedDate,
  driverDetailsHandler,
  constructorDetailsHandler,
  raceDetailsHandler,
  racesFilter,
} from '../../helper';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import YearPicker from '../../components/YearPicker/YearPicker';
import Loader from '../../components/Loader/Loader';

export class Races extends Component {
  state = {
    races: [],
    year: 2022,
    query: '',
    loading: true,
  };

  componentDidMount() {
    this.fetchRaces();
  }

  fetchRaces = () => {
    axios.get(`http://ergast.com/api/f1/${this.state.year}/results/1.json`).then((res) => {
      this.setState({
        races: res.data.MRData.RaceTable.Races,
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
    this.setState(
      {
        year: event.target.value,
        loading: true,
      },
      () => this.fetchRaces()
    );
  };

  render() {
    const { loading, query, year } = this.state;
    const races = racesFilter(this.state.races, query);

    if (loading) return <Loader />;
    const racesTable = (
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Grand Prix</th>
            <th>Circuit</th>
            <th>Date</th>
            <th>Winner</th>
            <th>Car</th>
            <th>Laps</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {races.map((result) => (
            <tr key={result.round}>
              <td>{result.round}</td>
              <td
                className='cursor'
                onClick={() => raceDetailsHandler(this.props, result.round, year)}
              >
                {result.raceName}
              </td>
              <td>{result.Circuit.circuitName}</td>
              <td>{getFormattedDate(result.date)}</td>
              <td
                className='cursor'
                onClick={() =>
                  driverDetailsHandler(this.props, result.Results[0].Driver.driverId, year)
                }
              >
                {result.Results[0].Driver.givenName + ' ' + result.Results[0].Driver.familyName}
              </td>
              <td
                className='cursor'
                onClick={() =>
                  constructorDetailsHandler(
                    this.props,
                    result.Results[0].Constructor.constructorId,
                    year
                  )
                }
              >
                {result.Results[0].Constructor.name}
              </td>
              <td>{result.Results[0].laps}</td>
              <td>{result.Results[0].Time.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    return (
      <div className='container'>
        <Breadcrumb elements={['races']} />

        <div className='header'>
          <h1 className='title'>
            <YearPicker year={year} onChange={this.yearHandler} /> Race Results
          </h1>
          <input
            className='navbar-search'
            type='text'
            value={query}
            placeholder='Search...'
            onChange={(event) => this.searchHandler(event)}
          />
        </div>
        {racesTable}
      </div>
    );
  }
}

export default Races;
