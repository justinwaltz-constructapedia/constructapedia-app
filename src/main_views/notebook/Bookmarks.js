import React, { useContext, useReducer } from 'react';
//Import for useContext
import {PlanContext} from '../../PlanContext.js'

// function init(initialBookmarks) {
//     console.log(initialBookmarks);
//     return {
//         bookmarks: initialBookmarks,
//         newBookmarkValue: '',
//         newBookmarkTitleValue: '',
//         editBookmarkValue: '',
//         editBookmarkTitleValue: '',
//         isSaving: false,
//         isEditing: false,
//         indexToEdit: -1,
//         error: ''
//     }
// }
function reducer (state, action) {
    switch (action.type) {
        case 'saving':
            return {
                ...state,
                error: '',
                isSaving: true
            }
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
export default function Bookmarks ({ savePlanChanges }) {
    /**
     * useContext Hook
     */
    const [contextState, contextDispatch] = useContext(PlanContext);
    const {plans, selectedPlanIndex, selectedStepIndex} = contextState;
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
    const { newBookmarkValue, newBookmarkTitleValue, editBookmarkValue, editBookmarkTitleValue, isSaving, isEditing, indexToEdit, error} = state;


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
        if (plans[selectedPlanIndex].bookmarks) {
            const updatedBookmarksList = [newBookmark].concat(
                [...plans[selectedPlanIndex].bookmarks]
            );
            updatedBookmarksObj = { bookmarks: updatedBookmarksList };
        } else {
            updatedBookmarksObj = { bookmarks: [newBookmark] };
        }
        console.log(
            plans[selectedPlanIndex].id,
            updatedBookmarksObj
        );
        savePlanChanges(
            plans[selectedPlanIndex].id,
            updatedBookmarksObj
        );
        dispatch({type:'field', field:'newBookmarkValue', payload:''});
        dispatch({type:'field', field:'newBookmarkTitleValue', payload:''});
    };

    const updateBookmark = () => {
        const updatedBookmark = {title: editBookmarkTitleValue, url: editBookmarkValue}
        const updatedBookmarksArr = [...plans[selectedPlanIndex].bookmarks];
        updatedBookmarksArr[indexToEdit] = updatedBookmark;
        savePlanChanges(plans[selectedPlanIndex].id,{bookmarks:updatedBookmarksArr})
        dispatch({type:'field', field: 'bookmarks', payload:updatedBookmarksArr})
        dispatch({type:'field', field:'editBookmarkValue', payload:''});
        dispatch({type:'field', field:'editBookmarkTitleValue', payload:''});
        dispatch({type:'editing',payload:-1});
    }

    const deleteBookmark = (indexToDelete) => {
        dispatch({type:'delete', payload:indexToDelete})
        alert("need delete funtion")
        //savePlanChanges(plans[selectedPlanIndex].id,{bookmarks:bookmarks})
        dispatch({type:'editing',payload:-1})
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
                                {plans[selectedPlanIndex].bookmarks.length > 0 &&
                                    plans[selectedPlanIndex].bookmarks.map(
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
                                                placeholder='Input URL'
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
