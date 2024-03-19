const cheerio = require('cheerio');
const axios = require('axios')

const url = 'http://kenyalaw.org/caselaw/cases/advanced_search_courts?court=190000'

//function to request the first page that contains the form/returns the first url to see the form
axios.get(url)
.then(response => {
    const $ = cheerio.load(response.data);
    const formUrl = $('form').attr('action')
    console.log(formUrl)
})
