import React, { Component } from 'react';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import './Drivers.css';
import { constructorDetailsHandler, driverDetailsHandler } from '../../helper';

export class Drivers extends Component {
  state = {
    driverStandings: [],
    round: 0,
    year: 2013,
    loading: true,
  };
  componentDidMount() {
    axios
      .get(`http://ergast.com/api/f1/${this.state.year}/driverStandings.json`)
      .then((res) => {
        const data = res.data.MRData.StandingsTable.StandingsLists[0];
        this.setState({
          driverStandings: data.DriverStandings,
          round: data.round,
          loading: false,
        });
      });
  }

  render() {
    return (
      <div className='container'>
        <h1 className='title'>{this.state.year} Driver Standings</h1>
        {this.state.loading ? (
          <BeatLoader color='#353a40' />
        ) : (
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
              {this.state.driverStandings.map((result) => (
                <tr key={result.position}>
                  <td>{result.position}</td>
                  <td
                    onClick={() =>
                      driverDetailsHandler(
                        this.props,
                        result.Driver.driverId,
                        this.state.year
                      )
                    }
                  >
                    {result.Driver.givenName + ' ' + result.Driver.familyName}
                  </td>
                  <td>{result.Driver.nationality}</td>
                  <td
                    onClick={() =>
                      constructorDetailsHandler(
                        this.props,
                        result.Constructors[0].constructorId,
                        this.state.year
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
        )}
      </div>
    );
  }
}

export default Drivers;
