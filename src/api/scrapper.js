function scrapper(link){
	console.log(link);
	return fetch(`http://localhost:3001/`, {
		method:'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({link:link})
		})
        .then(
            res => {
                console.log(typeof res, res)
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
export {scrapper};
