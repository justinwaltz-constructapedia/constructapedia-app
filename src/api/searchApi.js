function getSearchResults(userInput) {
    userInput = userInput.trim();
    userInput = userInput.replace(/ /g, "+");
    console.log("Sending...")
    return fetch(`https://constructapediawebapi.herokuapp.com/results/${userInput}`)
        .then(
            res => {
                //console.log(res.json())
                return res.json()
            })
        .then(
            res => {
                console.log(res);
                return res.results
            },
            error => {
            // error handling
                console.log(error);
                return error;
            }
        );
}
function postSelectionToScrape (url) {
    return fetch("https://constructapediawebapi.herokuapp.com/selection/", {
        method:"post",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body:`selection_endpoint=${url}`
    })
    .then( (httpResponse) => {
      if (httpResponse.ok) {
        console.log(httpResponse);
        return httpResponse.json();
      } else {
        return Promise.reject("Fetch did not succeed");
      }
    } )
    .then( (json) => {
        console.log(json)
        return json;
      })
    .catch(err => console.log(err));
}

function googleSearch(userInput) {
    userInput = userInput.trim();
    //userInput = userInput.replace(/ /g, "+");
    console.log(userInput)
    return fetch(`https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyBKTWe4wGg1njqacyy3w3zAwT7Az3171sM&cx=f0e7e5d84502655e2&q=${userInput}`)
    .then(
        res => {
            //console.log(res.json())
            return res.json()
        }
    )
    .then(
        res => {
            console.log(res);
            return res
        },
    error => {
        // error handling
        console.log(error);
        return error;
        }
    );
}
export {getSearchResults, postSelectionToScrape, googleSearch};
