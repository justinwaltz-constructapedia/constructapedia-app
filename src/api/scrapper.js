function scrapper(link) {
    console.log(link);
    //http://localhost:3001/
    return fetch(`https://constructapedia-api.herokuapp.com/`, {
        method: 'post',
        // headers: {'Content-Type': 'application/json'},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `link=${link}`,
    }).then((res) => {
        return res.json();
    }).then((json) => {
        console.log('scrapper ln13',json);
        return json
    }).catch((error) => {
        // error handling
        console.log(error);
        return error;
    })
}

export { scrapper };
