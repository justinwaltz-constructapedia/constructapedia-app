
function postAuthLogin(email, password, rememberMe) {
    let success;
    return fetch( "https://constructapediawebapi.herokuapp.com/authentication/login/", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email,password: password})
    } )
    .then( (httpResponse) => {
        console.log(httpResponse);
        success=httpResponse.ok
      if (httpResponse.ok) {
        return httpResponse.json();
      } else {
        return Promise.reject("Fetch did not succeed");
      }
    } )
    .then( (json) => {
        const result = json.result;
        const createdDate = new Date();
        console.log(createdDate);
        localStorage.setItem('rememberMe', rememberMe);
        localStorage.setItem('user_id', result.user_id);
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('refresh_token', result.refresh_token);
        localStorage.setItem('tokenCreatedDate', createdDate)
        return success;
     })
    .catch(err => {
        console.log(err)
        return err;
    });
}
function postAuthSignUp (name,email,password) {
    let success;
    return fetch( "https://constructapediawebapi.herokuapp.com/authentication/signup/", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name: name, email: email, password: password})
    } )
    .then( (httpResponse) => {
        if (httpResponse.ok) {
            success = httpResponse.ok;
            return httpResponse.json();
        } else {
            return Promise.reject("Fetch did not succeed");
        }
    } )
    .then( (json) => {
        console.log(json)
        return success;
    })
    .catch(err => console.log(err));
}
export {postAuthLogin, postAuthSignUp};
