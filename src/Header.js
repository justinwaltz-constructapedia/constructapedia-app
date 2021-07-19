import React from 'react';
import './Custom.css';

function Header(props) {
  return (
    <header>
      <div className='navbar-fixed'>
        <nav className='z-depth-1 indigo lighten-5 nav-bar-override'>
          <div className='header-width'>
            <div className='nav-wrapper white'>
              <a
                href='index.html'
                className='brand-logo left indigo-text text-darken-3 header-name'
              >
                <b>Constructapedia</b>
              </a>
            </div>
            <div class='nav-wrapper right'>
              <a
                href='#slide-out'
                data-target='slide-out'
                className='sidenav-trigger white-text show-on-large indigo-text text-darken-3'
              >
                <i className='material-icons header-icon'>more_horiz</i>
              </a>
            </div>
          </div>
        </nav>
      </div>
      {/* <div className="container">
                <a href="#projects" data-target="project-nav" className="top-nav sidenav-trigger full hide-on-large-only"><i className="medium material-icons">view_list</i></a>
            </div> */}
    </header>
  );
}

export default Header;
