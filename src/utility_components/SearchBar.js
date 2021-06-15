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
                        <input id="search_input" type="text" value={searchValue} className="validate" onChange={(e)=> setSearchValue(e.target.value)} />
                        <label className="active" htmlFor="search_input">Search for a Project</label>
                    </div>
                    <button className="btn-small waves-effect waves-light blue" type="submit" name="action"><i className="material-icons">arrow_forward</i></button>
                </div>
            </div>
    </form>)
}

export default SearchBar;
