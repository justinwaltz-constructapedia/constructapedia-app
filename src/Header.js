import React from 'react';
//Import Style
import './Custom.css';

function Header(props) {
    //Return View for Header
    //Includes Home and Side nav button with account options
    return (
            <div className='navbar-fixed nav-bar-override'>
                <nav className='z-depth-1 indigo lighten-5 nav-bar-override'>
                    <div className='header-width'>
                        <div className='nav-wrapper'>
                            <a
                                href='index.html'
                                className='brand-logo left indigo-text text-darken-3 header-name'
                            >
                                <b>Constructapedia</b>
                            </a>
                            <div className='nav-wrapper right'>
                                <a
                                    href='#slide-out'
                                    data-target='slide-out'
                                    className='sidenav-trigger show-on-large indigo-text text-darken-3'
                                >
                                    <i className='large material-icons header-icon'>
                                        more_horiz
                                    </i>
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
    );
}

export default Header;
