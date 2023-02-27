import React, { Component } from 'react';
import axios from 'axios';

import './DriverDetails.css';
import {
  constructorDetailsHandler,
  getFormattedDate,
  nationalityToCountryCodeConverter,
  raceDetailsHandler,
} from '../../helper';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import Loader from '../Loader/Loader';

export class DriverDetails extends Component {
  state = {
    driver: null,
    results: null,
    year: null,
    loading: true,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    const query = new URLSearchParams(this.props.location.search);
    const year = query.get('year');

    let endpoints = [
      `http://ergast.com/api/f1/${year}/drivers/${id}/driverStandings.json`,
      `http://ergast.com/api/f1/${year}/drivers/${id}/results.json`,
      'https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json',
    ];

    axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
      const driver = res[0].data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
      const countryCode = nationalityToCountryCodeConverter(res[2].data, driver.Driver.nationality);
      this.setState({
        driver: driver,
        results: res[1].data.MRData.RaceTable.Races,
        year: year,
        countryCode: countryCode,
        loading: false,
      });
    });
  }

  render() {
    const { loading, driver, countryCode, year, results } = this.state;

    if (loading) return <Loader />;

    const driverContent = (
      <div>
        <Breadcrumb elements={['drivers', `${driver.Driver.driverId}`]} />
        <div className='driver-details'>
          <div className='driver-profile'>
            <img
              src='https://api.lorem.space/image/face?w=300&h=200'
              alt='Driver 1 placeholder'
              className='driver-profile-img'
            />
            <div className='driver-profile-data'>
              <img src={`https://flagsapi.com/${countryCode}/shiny/64.png`} alt='Flag' />
              <h1>
                {driver.Driver.givenName} {driver.Driver.familyName}
              </h1>
            </div>
          </div>
          <div className='driver-stats'>
            <table className='driver-stats__table'>
              <tbody>
                <tr>
                  <td>Team:</td>
                  <td
                    className='cursor'
                    onClick={() =>
                      constructorDetailsHandler(
                        this.props,
                        driver.Constructors[0].constructorId,
                        year
                      )
                    }
                  >
                    <strong>{driver.Constructors[0].name}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Championship Position:</td>
                  <td>{driver.position}</td>
                </tr>
                <tr>
                  <td>Points:</td>
                  <td>{driver.points}</td>
                </tr>
                {driver.wins !== '0' && (
                  <tr>
                    <td>Wins:</td>
                    <td>{driver.wins}</td>
                  </tr>
                )}
                <tr>
                  <td>Date of birth:</td>
                  <td>{getFormattedDate(driver.Driver.dateOfBirth)}</td>
                </tr>
                <tr>
                  <td>Bio:</td>
                  <td>
                    <a href={driver.Driver.url} target='_blank'>
                      Wiki
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Grand Prix</th>
              <th>Date</th>
              <th>Car</th>
              <th>Position</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.round}>
                <td>{result.round}</td>
                <td
                  className='cursor'
                  onClick={() => {
                    raceDetailsHandler(this.props, result.round, year);
                  }}
                >
                  {result.raceName}
                </td>
                <td>{getFormattedDate(result.date)}</td>
                <td
                  className='cursor'
                  onClick={() =>
                    constructorDetailsHandler(
                      this.props,
                      driver.Constructors[0].constructorId,
                      year
                    )
                  }
                >
                  {result.Results[0].Constructor.name}
                </td>
                <td>
                  {result.Results[0].positionText === 'R' ? 'DNF' : result.Results[0].position}
                </td>
                <td className={`position-${result.Results[0].position}`}>
                  {result.Results[0].points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return <div className='container'>{driverContent}</div>;
  }
}

export default DriverDetails;
