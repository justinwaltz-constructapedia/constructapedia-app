import React from 'react';
function Header (props) {

    return (
        <header>
            <nav className="top-nav black z-depth-0">
                <div className="nav-wrapper blue-grey darken-4 blue-grey-text text-lighten-5">
                    <a href="index.html" className="brand-logo center">Contructapedia</a>
                    <ul className="right">
                        <li><a href="#slide-out" data-target="slide-out" className="sidenav-trigger white-text show-on-large"><i className="large material-icons">account_circle</i></a></li>
                    </ul>
                </div>
            </nav>
            {/* <div className="container">
                <a href="#projects" data-target="project-nav" className="top-nav sidenav-trigger full hide-on-large-only"><i className="medium material-icons">view_list</i></a>
            </div> */}

        </header>
    )
}

export default Header;
