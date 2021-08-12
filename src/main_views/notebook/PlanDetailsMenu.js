import React, { useEffect, useRef } from 'react';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

function PlanDetailsMenu(props) {
    const navBar = useRef(null);

    useEffect(() => {
        const navBarOptions = {
            constrainWidth: false,
            hover: true,
            belowOrigin: true,
            alignment: 'left',
            toolbarEnabled: true,
        };
        M.FloatingActionButton.init(navBar.current, navBarOptions);
    }, []);

    return (
        <div className='fixed-action-btn toolbar' ref={navBar}>
            <a href='#addMenu' className='btn-floating btn-large indigo'>
                <i className='material-icons'>assignment</i>
            </a>
            <ul>
                <li className='waves-effect waves-light red accent-4'>
                    <a
                        id='add-quickNotes-btn'
                        href='#add-modal'
                        onClick={(e) => props.openAddModal(e)}
                    >
                        <i className='material-icons'>edit</i>
                    </a>
                </li>
                <li className='waves-effect waves-light'>
                    <a
                        id='add-checklist-btn'
                        href='#add-modal'
                        onClick={(e) => props.openAddModal(e)}
                    >
                        <i className='material-icons'>offline_pin</i>
                    </a>
                </li>
                <li className='waves-effect waves-light indigo lighten-1'>
                    <a
                        id='add-substep-btn'
                        href='#add-modal'
                        onClick={(e) => props.openAddModal(e)}
                    >
                        <i className='material-icons'>traffic</i>
                    </a>
                </li>
                <li className='waves-effect waves-light'>
                    <a
                        id='add-folder-btn'
                        href='#add-modal'
                        className='btn disabled'
                        onClick={(e) => alert('Not ready yet Zach!')}
                    >
                        <i className='material-icons'>camera</i>
                    </a>
                </li>
            </ul>
        </div>
    );
}
export default PlanDetailsMenu;

/*
const projectNav = useRef(null);
useEffect(() => {
    const projectNavOptions = {
        inDuration: 250,
        outDuration: 200,
        draggable: true
    };
    M.Sidenav.init(projectNav.current, projectNavOptions);
},[]);
ref={projectNav} className="sidenav sidenav-fixed z-depth-0

*/
