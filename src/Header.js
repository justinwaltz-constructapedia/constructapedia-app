import React from 'react';
function Header(props) {
  return (
    <header>
      <div>
        <nav className='z-depth-1 white'>
          <div className='nav-wrapper white'>
            <div className='container'>
              <a
                href='index.html'
                className='brand-logo left indigo-text text-darken-3 white'
              >
                <b>Contructapedia</b>
              </a>
            </div>
            <ul className='right'>
              <li>
                <a
                  href='#slide-out'
                  data-target='slide-out'
                  className='sidenav-trigger white-text show-on-large indigo-text text-darken-3'
                >
                  <i className='large material-icons'>more_horiz</i>
                </a>
              </li>
            </ul>
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
