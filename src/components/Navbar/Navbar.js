import React, { Component } from 'react';

import './Navbar.css';
import NavbarItem from './NavbarItem/NavbarItem';

export class Navbar extends Component {
  render() {
    const navigationItems = [
      {
        name: 'Drivers',
        link: `/drivers?year=${this.props.year}`,
      },
      {
        name: 'Constructors',
        link: `/constructors?year=${this.props.year}`,
      },
      {
        name: 'Races',
        link: `/races?year=${this.props.year}`,
      },
    ];

    let navbarItems = navigationItems.map((item) => {
      return (
        <NavbarItem key={item.name} name={item.name} link={item.link} year={this.props.year} />
      );
    });
    return (
      <div className='navbar'>
        <div className='navbar-nav'>{navbarItems}</div>
      </div>
    );
  }
}

export default Navbar;
