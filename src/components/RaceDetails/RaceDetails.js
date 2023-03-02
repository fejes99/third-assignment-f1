import React, { Component } from 'react';
import axios from 'axios';

import './RaceDetails.css';
import {
  constructorDetailsHandler,
  driverDetailsHandler,
  nationalityToCountryCodeConverter,
} from '../../helper';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import Loader from '../Loader/Loader';

export class RaceDetails extends Component {
  state = {
    qualiResults: [],
    raceResults: [],
    circuitData: [],
    year: null,
    loading: true,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    const year = new URLSearchParams(this.props.location.search).get('year');

    let endpoints = [
      `https://ergast.com/api/f1/${year}/${id}/qualifying.json`,
      `https://ergast.com/api/f1/${year}/${id}/results.json`,
      'https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json',
    ];

    axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
      const circuitData = res[1].data.MRData.RaceTable.Races[0].Circuit;
      const countryCode = nationalityToCountryCodeConverter(
        res[2].data,
        circuitData.Location.country
      );
      this.setState({
        qualiResults: res[0].data.MRData.RaceTable.Races[0].QualifyingResults,
        raceResults: res[1].data.MRData.RaceTable.Races[0].Results,
        circuitData: circuitData,
        year: year,
        countryCode: countryCode,
        loading: false,
      });
    });

    Promise.all([
      axios.get(`https://ergast.com/api/f1/${year}/${id}/qualifying.json`),
      axios.get(`https://ergast.com/api/f1/${year}/${id}/results.json`),
      axios.get(
        'https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json'
      ),
    ]).then((res) => {});
  }

  render() {
    const { loading, qualiResults, raceResults, circuitData, countryCode, year } = this.state;

    if (loading) return <Loader />;

    const raceContent = (
      <div>
        <Breadcrumb year={this.state.year} elements={['races', `${circuitData.circuitId}`]} />
        <div className='race-details'>
          <div className='race-profile'>
            <h1>{circuitData.circuitName}</h1>
            <img src={`https://flagsapi.com/${countryCode}/shiny/64.png`} alt='Flag' />
          </div>
          <div className='race-stats'>
            <table className='race-stats__table'>
              <tbody>
                <tr>
                  <td>Year:</td>
                  <td>{year}</td>
                </tr>
                <tr>
                  <td>Location:</td>
                  <td>{circuitData.Location.locality}</td>
                </tr>
                <tr>
                  <td>Bio:</td>
                  <td>
                    <a href={circuitData.url} target='_blank'>
                      Wiki
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='result-tables'>
          <div className='result-wrapper'>
            <h1>Qualifying Results</h1>
            <table>
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Driver</th>
                  <th>Car</th>
                  <th>Q1</th>
                  <th>Q2</th>
                  <th>Q3</th>
                </tr>
              </thead>
              <tbody>
                {qualiResults.map((result) => (
                  <tr key={result.number}>
                    <td>{result.position}</td>
                    <td
                      className='cursor'
                      onClick={() => {
                        driverDetailsHandler(this.props, result.Driver.driverId, year);
                      }}
                    >
                      {result.Driver.givenName + ' ' + result.Driver.familyName}
                    </td>
                    <td
                      className='cursor'
                      onClick={() => {
                        constructorDetailsHandler(
                          this.props,
                          result.Constructor.constructorId,
                          year
                        );
                      }}
                    >
                      {result.Constructor.name}
                    </td>
                    <td>{result.Q1 !== null ? result.Q1 : ''}</td>
                    <td>{result.Q2 !== null ? result.Q2 : ''}</td>
                    <td>{result.Q3 !== null ? result.Q3 : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='vl'></div>
          <div className='result-wrapper'>
            <h1>Race Results</h1>
            <table>
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Driver</th>
                  <th>Car</th>
                  <th>Laps</th>
                  <th>Result</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {raceResults.map((result) => (
                  <tr key={result.position}>
                    <td>{result.position}</td>
                    <td
                      className='cursor'
                      onClick={() => {
                        driverDetailsHandler(this.props, result.Driver.driverId, year);
                      }}
                    >
                      {result.Driver.givenName + ' ' + result.Driver.familyName}
                    </td>
                    <td
                      className='cursor'
                      onClick={() => {
                        constructorDetailsHandler(
                          this.props,
                          result.Constructor.constructorId,
                          year
                        );
                      }}
                    >
                      {result.Constructor.name}
                    </td>
                    <td>{result.laps}</td>
                    <td>{result.Time ? result.Time.time : 'No time'}</td>
                    <td>{result.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    return <div className='container'>{raceContent}</div>;
  }
}

export default RaceDetails;
