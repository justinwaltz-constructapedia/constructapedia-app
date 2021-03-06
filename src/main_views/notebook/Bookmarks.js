import React, { useContext, useReducer } from 'react';
//Import for useContext
import {PlanContext} from '../../PlanContext.js'

function reducer (state, action) {
    switch (action.type) {
        // case 'saving':
        //     return {
        //         ...state,
        //         error: '',
        //         isSaving: true
        //     }
        case 'editing':
            return {
                ...state,
                isEditing: action.payload >= 0,
                indexToEdit: action.payload
            }
        case 'field':
            return {
                ...state,
                [action.field]: action.payload
            };
        // case 'addItem':
        //     return {
        //         ...state,
        //         bookmarks: {
        //             ...state.bookmarks,
        //             [action.field]: action.payload[action.field]
        //         }
        //     }
        // case 'delete':
        //     return {
        //         ...state,
        //         bookmarks: state.bookmarks.filter((_, index) => index !== action.payload)
        //     }
        // case 'error':
        //     return {
        //         ...state,
        //         error: action.payload,
        //         isSaving: false,
        //     }

        default:
            return state;
    }
}
export default function Bookmarks ({ bookmarks, savePlanChanges }) {
    /**
     * useContext Hook
     */
    const [contextState] = useContext(PlanContext);
    const {selectedSowId} = contextState;
    /**
     * useReducer Hook
     */
    const initialState = {
        newBookmarkValue: '',
        newBookmarkTitleValue: '',
        editBookmarkValue: '',
        editBookmarkTitleValue: '',
        isSaving: false,
        isEditing: false,
        indexToEdit: -1,
        error: ''
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    const { newBookmarkValue, newBookmarkTitleValue, editBookmarkValue, editBookmarkTitleValue, isEditing, indexToEdit} = state;

    const addBookmark = () => {
        let bookmarkTitle;
        if (!newBookmarkTitleValue) {
            let startIndex = newBookmarkValue.indexOf('.')+1;
            let endIndex = newBookmarkValue.indexOf('.', startIndex)
            bookmarkTitle = newBookmarkValue.substring(startIndex, endIndex)
        } else {
            bookmarkTitle = newBookmarkTitleValue;
        }
        const newBookmark = {
            url: newBookmarkValue,
            title: bookmarkTitle,
        };
        let updatedBookmarksObj;
        if (bookmarks.length > 0) {
            const updatedBookmarksList = [newBookmark].concat(
                [...bookmarks]
            );
            updatedBookmarksObj = { bookmarks: updatedBookmarksList };
        } else {
            updatedBookmarksObj = { bookmarks: [newBookmark] };
        }
        savePlanChanges(
            selectedSowId,
            updatedBookmarksObj
        );
        dispatch({type:'field', field:'newBookmarkValue', payload:''});
        dispatch({type:'field', field:'newBookmarkTitleValue', payload:''});
    };

    const updateBookmark = () => {
        const updatedBookmark = {title: editBookmarkTitleValue, url: editBookmarkValue}
        const updatedBookmarksArr = [...bookmarks];
        updatedBookmarksArr[indexToEdit] = updatedBookmark;
        savePlanChanges(selectedSowId,{bookmarks:updatedBookmarksArr})
        dispatch({type:'field', field:'editBookmarkValue', payload:''});
        dispatch({type:'field', field:'editBookmarkTitleValue', payload:''});
        dispatch({type:'editing',payload:-1});
    }

    const deleteBookmark = (indexToDelete) => {
        const currentBookmarks = [...bookmarks];
        const updatedBookmarks = currentBookmarks.filter((_, index) => index !== indexToDelete)
        savePlanChanges(selectedSowId,{bookmarks:updatedBookmarks});
        dispatch({type:'field', field:'editBookmarkValue', payload:''});
        dispatch({type:'field', field:'editBookmarkTitleValue', payload:''});
        dispatch({type:'editing',payload:-1});
    }
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
                                                            {(indexToEdit === i && isEditing)
                                                                ? <div className='input-field inline'>
                                                                    <input
                                                                        placeholder={bookmark.title}
                                                                        id={'edit-bookmark-url'+i}
                                                                        type='text'
                                                                        className='validate'
                                                                        value={
                                                                            state.editBookmarkTitleValue
                                                                        }
                                                                        onChange={(e) =>
                                                                            dispatch({
                                                                                type: 'field',
                                                                                field: 'editBookmarkTitleValue',
                                                                                payload: e.currentTarget.value,
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                                :
                                                                <p>{bookmark.title}</p>
                                                            }

                                                        </td>
                                                        <td className='red-text'>
                                                            {(indexToEdit === i && isEditing)
                                                                ? <div className='input-field inline'>
                                                                    <input
                                                                        placeholder={bookmark.url}
                                                                        id={'edit-bookmark'+i}
                                                                        type='text'
                                                                        className='validate'
                                                                        value={
                                                                            editBookmarkValue
                                                                        }
                                                                        onChange={(e) =>
                                                                            dispatch({
                                                                                type: 'field',
                                                                                field: 'editBookmarkValue',
                                                                                payload: e.currentTarget.value,
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                                :
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
                                                            }

                                                        </td>
                                                        <td>
                                                            {(indexToEdit === i && isEditing)
                                                                ? <div>
                                                                    <a
                                                                        href='#!'
                                                                        className = 'right btn red accent-4'
                                                                        onClick = {() => {
                                                                                dispatch({type:'field', field:'editBookmarkTitleValue', payload:''})
                                                                                dispatch({type:'field', field:'editBookmarkValue', payload:''})
                                                                                dispatch({type:'editing',payload:-1})
                                                                                console.log(indexToEdit === i, isEditing);
                                                                            }
                                                                        }
                                                                    >
                                                                        <i className = 'material-icons'>
                                                                            close
                                                                        </i>
                                                                    </a>
                                                                    <a
                                                                        href='#!'
                                                                        className = 'right btn red accent-4'
                                                                        onClick = {() => {
                                                                                dispatch({type:'field', field:'editBookmarkTitleValue', payload:bookmark.title})
                                                                                dispatch({type:'field', field:'editBookmarkValue', payload:bookmark.url})
                                                                                dispatch({type:'editing',payload:i})
                                                                                updateBookmark();
                                                                            }
                                                                        }
                                                                    >
                                                                        <i className = 'material-icons'>
                                                                            save
                                                                        </i>
                                                                    </a>
                                                                    <a
                                                                        href='#!'
                                                                        className = 'right btn red accent-4'
                                                                        onClick = {() => {deleteBookmark(i)}
                                                                        }
                                                                    >
                                                                        <i className = 'material-icons'>
                                                                            delete_forever
                                                                        </i>
                                                                    </a>
                                                                </div>
                                                                :
                                                                <a
                                                                    href='#!'
                                                                    className = 'right btn red accent-4'
                                                                    onClick = {() => {
                                                                            dispatch({type:'field', field:'editBookmarkTitleValue', payload:bookmark.title})
                                                                            dispatch({type:'field', field:'editBookmarkValue', payload:bookmark.url})
                                                                            dispatch({type:'editing',payload:i})
                                                                            console.log(indexToEdit === i, isEditing);
                                                                        }
                                                                    }
                                                                >
                                                                    <i className = 'material-icons'>
                                                                        border_color
                                                                    </i>
                                                                </a>
                                                            }
                                                        </td>
                                                    </tr>
                                            );
                                        }
                                    )}
                                <tr>
                                    <td>
                                        <div className='input-field inline'>
                                            <input
                                                placeholder='www.example.com'
                                                id='add-bookmark-url'
                                                type='text'
                                                className='validate'
                                                value={
                                                    newBookmarkValue
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
