import React, { useState } from 'react';

//Props: A function passed as handleSearch that takes the user's search terms as its parameter
function SearchBar(props) {
    //Use State variables
    const [searchValue, setSearchValue] = useState('');

    return (
        <form
            className=''
            onSubmit={(e) => {
                e.preventDefault();
                props.handleSearch(searchValue);
            }}
        >
            <div className='input-field inline'>
                <input
                    id='search_input'
                    type='text'
                    className='validate'
                    placeholder={props.placeholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <button
                className='btn-small waves-effect waves-light indigo'
                type='submit'
                name='action'
            >
                <i className='material-icons'>search</i>
            </button>
        </form>
    );
}

export default SearchBar;
