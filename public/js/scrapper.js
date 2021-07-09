const request = require('request');
const cheerio = require('cheerio');

//make a request
request('https://www.thespruce.com/how-to-install-a-wall-shelf-1824826',(error, response, html) => {
	if(!error && response.statusCode==200){
		//saving the html in a variable $ and loading it with cheerio
		const $ = cheerio.load(html);

		const siteHeading = $('.heading__title');
		//console.log(siteHeading.html());
		console.log(siteHeading.text());

		//const toolsHeading = $('.materials-group_heading h3');
		//console.log(toolsHeading.html());

		//looping materials we have a class-> comp and materials-list, under that a ul tag which has our list.

		$('.comp.materials-list ul').each((index, element)=>{
			const item = $(element).text().replace(/\s\s+/g,'\n');

			console.log(item);
		});

		$('.comp.text-passage.structured-content.how-to__steps.mntl-sc-page.mntl-block ol').each((index_p,element_p)=> {
			const item_p = $(element_p).text().replace(/\s\s+/g,'\n');

			console.log(item_p);
		});
	}
});