import React, {useState} from 'react';

//Props: A function passed as handleSearch that takes the user's search terms as its parameter
function SearchBar (props) {
    const [searchValue, setSearchValue] = useState('');

    return (
        <form className="col s12" onSubmit={(e)=> {
                e.preventDefault();
                props.handleSearch(searchValue);
            }
            }>
            <div className="row">
                <div className="col s12 center-align">
                    <div className="input-field inline">
                        <input id="search_input" type="text"
                                className="validate blue-grey darken-4 blue-grey-text text-lighten-5"
                                placeholder="Constructapedia"
                                value={searchValue}
                                onChange={(e)=> setSearchValue(e.target.value)} />

                    </div>
                    <button className="btn-small waves-effect waves-light blue-grey darken-3 blue-grey-text text-lighten-5" type="submit" name="action"><i className="material-icons">search</i></button>
                </div>
            </div>
    </form>)
}

export default SearchBar;
/*
<label className="active" htmlFor="search_input"></label>
 */
