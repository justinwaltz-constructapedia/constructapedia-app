function getUserData () {
    const user_id = localStorage.getItem('user_id');
    const access_token = localStorage.getItem('access_token');
    //const refresh_token = localStorage.getItem('refresh_token')
    return fetch( `https://constructapediawebapi.herokuapp.com/user/${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        }
    } )
    .then( (httpResponse) => {
      if (httpResponse.ok) {
        return httpResponse.json();
      } else {
        return Promise.reject("Fetch did not succeed");
      }
    } )
    .then( (json) => {
        const userData = json.result
        delete userData._id;
        return json.result;
      })
    .catch(err => console.log(err));
}

function putUserUpdate (dataToUpdate) {
    console.log("sending put request to update user")
    const user_id = localStorage.getItem('user_id');
    const access_token = localStorage.getItem('access_token');
    //const refresh_token = localStorage.getItem('refresh_token')
    return fetch( `https://constructapediawebapi.herokuapp.com/user/${user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
      },
      body: JSON.stringify(dataToUpdate)
    } )
    .then((httpResponse) => {
      if (httpResponse.ok) {
        return httpResponse.json();
      } else {
        return Promise.reject("Fetch did not succeed");
      }
    })
    .then( (json) => {
        console.log(json.result)
        //return json.result;
      })
    .catch(err => console.log(err));
}

export {getUserData, putUserUpdate};
