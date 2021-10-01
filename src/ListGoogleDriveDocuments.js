import React, { useState } from 'react';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  // {
  //   title: 'Last Modified Date',
  //   dataIndex: 'modifiedTime',
  //   key: 'modifiedTime',
  //   render: (text) => <span>{moment(text).format('Do MMM YYYY HH:mm A')}</span>,
  // },
  {
    title: 'Action',
    key: 'status',
    dataIndex: 'status',
    render: (tag) => (
      <span>
          <button className='btn disabled' type="button">
            Select
          </button>
      </span>
    ),
  },
];
const ListGoogleDriveDocuments = ({ visible, onClose, documents = [], onSearch, signedInUser, onSignOut, isLoading }) => {
    const [searchValue, setSearchValue] = useState('')
  const search = (value) => {
    onSearch(value);
    // delayedQuery(`name contains '${value}'`);
  };

  // const delayedQuery = useCallback(
  //   debounce((q) => onSearch(q), 500),
  //   []
  // );

  return (
    <div>
      <div className='row'>
        <div className='col s12'>
          <div className='section'>
            <p>Signed In as: {`${signedInUser} `}</p>
            <button type="button" className='btn' onClick={onSignOut}>
              Sign Out
            </button>
          </div>
          <div className="table-card-actions-container">
            {/*<div className="row">
                <div className="input-field col s6">
                    <input placeholder="" id="google-search-input" type="text" className="validate" onChange={(e) => setSearchValue(e.target.value)}/>
                    <label htmlFor="google-search-input">Search Google Drive</label>
                </div>
                <div className='col s3'>
                    <button type="button" className='btn' onClick={() => search(searchValue)}>
                        Search
                    </button>
                </div>
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListGoogleDriveDocuments;

/*
<Table
  className="table-striped-rows"
  columns={columns}
  dataSource={documents}
  pagination={{ simple: true }}
  loading={isLoading}
/>
(${signedInUser?.zu})
 */
