function scrapper(link){
	console.log(link);
	//http://localhost:3001/
	//
	return fetch(`https://constructapedia-api.herokuapp.com/`, {
		method:'post',
		// headers: {'Content-Type': 'application/json'},
		headers: {"Content-Type": "application/x-www-form-urlencoded"},
		body: `link=${link}`
		})
        .then(
            res => {
                console.log(res)
                return res.json()
            },
            error => {
            // error handling
                console.log(error);
                return error;
            }
        );
}
export {scrapper};
