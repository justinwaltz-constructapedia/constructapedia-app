//Gets access_token and refreshes if needed
const user_id = localStorage.getItem('user_id');
let access_token = localStorage.getItem('access_token');
/*
function checkAccessToken () {
        return new Promise((resolve,reject) => {
            const currentDate = new Date();
            const tokenCreatedDate = Date.parse(localStorage.getItem('tokenCreatedDate'));
            console.log(currentDate, tokenCreatedDate);
            let response;
            if (currentDate - tokenCreatedDate > 345600000) {
                const refresh_token = localStorage.getItem('refresh_token');

                fetch( `https://constructapediawebapi.herokuapp.com/authentication/refresh`, {
                    //mode:mode: 'no-cors',
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${refresh_token}`
                    }
                } )
                .then( (httpResponse) => {
                  if (httpResponse.ok) {
                    console.log(httpResponse)
                    return httpResponse.json();
                  } else {
                    response = Promise.reject("Fetch did not succeed");
                  }
                } )
                .then( (json) => {
                    const newAccessToken = json.access_token;
                    localStorage.setItem('access_token',newAccessToken);
                    console.log(newAccessToken)
                    access_token = newAccessToken;
                    response = true;
                    resolve(response);
                  })
                .catch(err => console.log(err));
                //reject(response)
            } else {
                response = true;
            }
        })
}
*/
function getUserData () {
    console.log(access_token)

    if (access_token) {
        /*
        return checkAccessToken().then( (res) => {
            console.log(res)
            if (res === true) {
        */
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
    /*
        })

    } else {
        return Promise.reject("no access_token");
    }
    */
}

function putUserUpdate (dataToUpdate) {
    console.log("sending put request to update user")
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
