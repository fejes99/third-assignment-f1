import React, { Component } from 'react';
import './Welcome.css';
import YearPicker from '../../components/YearPicker/YearPicker';

export class Welcome extends Component {
  state = {
    year: 2022,
  };

  yearHandler = (event) => {
    this.props.yearHandler(event.target.value);
  };

  render() {
    return (
      <div className='welcome'>
        <h1 className='welcome-header'>Welcome, pick a year</h1>
        <YearPicker year={this.state.year} onChange={this.yearHandler} />
      </div>
    );
  }
}

export default Welcome;
