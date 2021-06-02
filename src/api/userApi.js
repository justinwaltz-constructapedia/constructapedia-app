//Gets access_token and refreshes if needed
const user_id = localStorage.getItem('user_id');
let access_token = localStorage.getItem('access_token');
function checkAccessToken () {
        return new Promise((resolve,reject) => {
            const currentDate = new Date();
            const tokenCreatedDate = Date.parse(localStorage.getItem('tokenCreatedDate'));
            console.log(currentDate, tokenCreatedDate);
            let response;
            if (currentDate - tokenCreatedDate > 345600000) {
                const refresh_token = localStorage.getItem('refresh_token');

                fetch( `https://constructapediawebapi.herokuapp.com/authorization/refresh`, {
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${refresh_token}`
                    }
                } )
                .then( (httpResponse) => {
                  if (httpResponse.ok) {
                    return httpResponse.json();
                  } else {
                    response = Promise.reject("Fetch did not succeed");
                  }
                } )
                .then( (json) => {
                    const newAccessToken = json.result;
                    console.log(newAccessToken)
                    localStorage.setItem('access_token',newAccessToken);
                    console.log(newAccessToken)
                    response = true;
                  })
                .catch(err => console.log(err));
            } else {
                response = true;
            }
            if (response === true) {
                resolve(response);
            } else {
                reject(response);
            }
        })
}

function getUserData () {
    console.log(access_token)
    console.log(checkAccessToken)
    if (access_token) {
        return checkAccessToken().then( (res) => {
            if (res === true) {
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
        })
    } else {
        return Promise.reject("no access_token");
    }
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
