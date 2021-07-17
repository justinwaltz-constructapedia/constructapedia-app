import React from 'react';
import './Custom.css';

function Header(props) {
  return (
    <header>
      <div className='navbar-fixed'>
        <nav className='z-depth-1 white'>
          <div className='header-width'>
            <div className='nav-wrapper white'>
              <a
                href='index.html'
                className='brand-logo left indigo-text text-darken-3 white header-name'
              >
                <b>Constructapedia</b>
              </a>
            </div>
            <div class='nav-wrapper'>
              <ul className='right'>
                <li>
                  <a
                    href='#slide-out'
                    data-target='slide-out'
                    className='sidenav-trigger white-text show-on-large indigo-text text-darken-3'
                  >
                    <i className='material-icons'>more_horiz</i>
                  </a>
                </li>
              </ul>
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
