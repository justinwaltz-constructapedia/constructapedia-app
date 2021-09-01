import React, { useReducer } from 'react';
//import SearchBar from '../../utility_components/SearchBar.js';
function init(initialBookmarks) {
    return {
        plan: initialBookmarks,
        newBookmarkValue: '',
        newBookmarkTitleValue: '',
        addModalHeader: '',
        addModalType: '',
        isSaving: false,
        error: ''
    }
}
function reducer (state, action) {
    switch (action.type) {
        case 'saving':
            return {
                ...state,
                error: '',
                isSaving: true
            }
        case 'field':
            return {
                ...state,
                [action.field]: action.payload
            };
        case 'addItem':
            return {
                ...state,
                plan: {
                    ...state.plan,
                    [action.field]: action.payload[action.field]
                    //[action.field]: state.plan[action.field].push(action.payload)
                }
            }
        case 'delete':
            return {
                ...state,
                plan:{
                    ...state.plan,
                    [action.field]: state.plan[action.field].filter((_, index) => index !== action.payload)
                }
            }
        case 'error':
            return {
                ...state,
                error: action.payload,
                isSaving: false,
            }

        default:
            return state;
    }
}
export default function Bookmarks ({bookmarks, addBookmark}) {
    //Reducer Hook
    const [state, dispatch] = useReducer(reducer, bookmarks, init)
    return (
        <section>
            <div className='row'>
                <div className='col s12'>
                    <div className='indigo-text'>
                        <span className=''>
                            <b>URL List</b>
                        </span>
                        <table className='striped'>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Link</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookmarks.length > 0 &&
                                    bookmarks.map(
                                        (bookmark, i) => {
                                            return (
                                                <tr
                                                    key={
                                                        bookmark.title +
                                                        i
                                                    }
                                                >
                                                    <td className='red-text'>
                                                        <p>
                                                            {
                                                                bookmark.title
                                                            }
                                                        </p>
                                                    </td>
                                                    <td className='red-text'>
                                                        <a
                                                            href={
                                                                'http://' +
                                                                bookmark.url
                                                            }
                                                            target='_blank'
                                                            className='truncate'
                                                            rel='noreferrer'
                                                        >
                                                            {
                                                                bookmark.url
                                                            }
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <a
                                                            href='#!'
                                                            className='right btn red accent-4'
                                                        >
                                                            <i className=' material-icons'>
                                                                border_color
                                                            </i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                <tr>
                                    <td>
                                        <div className='input-field inline'>
                                            <input
                                                placeholder='Input URL'
                                                id='add-bookmark-url'
                                                type='text'
                                                className='validate'
                                                value={
                                                    state.newBookmarkValue
                                                }
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'field',
                                                        field: 'newBookmarkValue',
                                                        payload: e.currentTarget.value,
                                                    })
                                                }
                                                onKeyDown={(
                                                    e
                                                ) => {
                                                    if (
                                                        e.keyCode ===
                                                        13
                                                    ) {
                                                        addBookmark();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <button
                                            className='btn-small waves-effect waves-light indigo'
                                            onClick={
                                                addBookmark
                                            }
                                        >
                                            <i className='material-icons'>
                                                add
                                            </i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}
