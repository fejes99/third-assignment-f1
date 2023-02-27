import React, { Component } from 'react';
import axios from 'axios';

import './Constructors.css';
import { constructorDetailsHandler, constructorsFilter } from '../../helper';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import YearPicker from '../../components/YearPicker/YearPicker';
import Loader from '../../components/Loader/Loader';

export class Constructors extends Component {
  state = {
    constructorStandings: [],
    year: 2022,
    query: '',
    loading: true,
  };

  componentDidMount() {
    this.fetchConstructors();
  }

  fetchConstructors = () => {
    axios
      .get(`http://ergast.com/api/f1/${this.state.year}/constructorStandings.json`)
      .then((res) => {
        this.setState({
          constructorStandings:
            res.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings,
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
      () => this.fetchConstructors()
    );
  };

  render() {
    const { loading, query, year } = this.state;
    const constructorStandings = constructorsFilter(this.state.constructorStandings, query);

    if (loading) return <Loader />;
    const constructorsTable = (
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>Nationality</th>
            <th>Wins</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {constructorStandings &&
            constructorStandings.map((result) => (
              <tr key={result.position}>
                <td>{result.position}</td>
                <td
                  className='cursor'
                  onClick={() =>
                    constructorDetailsHandler(this.props, result.Constructor.constructorId, year)
                  }
                >
                  {result.Constructor.name}
                </td>
                <td>{result.Constructor.nationality}</td>
                <td>{result.wins}</td>
                <td>{result.points}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );

    return (
      <div className='container'>
        <Breadcrumb elements={['constructors']} />
        <div className='header'>
          <h1 className='title'>
            <YearPicker year={year} onChange={this.yearHandler} /> Constructor Standings
          </h1>
          <input
            className='navbar-search'
            type='text'
            value={query}
            placeholder='Search...'
            onChange={(event) => this.searchHandler(event)}
          />
        </div>
        {constructorsTable}
      </div>
    );
  }
}

export default Constructors;
