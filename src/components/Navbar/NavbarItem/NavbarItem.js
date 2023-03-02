import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import './NavbarItem.css';

export class NavbarItem extends Component {
  isActive = () => {
    const pathName = this.props.location.pathname.replace('/', '');
    const year = new URLSearchParams(this.props.location.search).get('year');

    return pathName.toLowerCase() === this.props.name.toLowerCase() && year === this.props.year;
  };

  render() {
    return (
      <div className='navbar-item'>
        <NavLink to={this.props.link} isActive={this.isActive} activeClassName='active'>
          {this.props.name}
        </NavLink>
      </div>
    );
  }
}

export default withRouter(NavbarItem);
