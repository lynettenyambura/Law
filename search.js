// const cheerio = require('cheerio');
// const axios = require('axios')

// const url = 'http://www.kenyalaw.org/kl/index.php?id=115'


// //  a GET request to fetch HTML content
// axios.get(url)
// .then(response => {


// const $ = cheerio.load(response.data);


// const headings=$('div[class="span6"] > h3').text()

// console.log(headings);
    
//     })
//     .catch(error => {
//         console.log(error);
//     });

import fetch from 'node-fetch';
import makeFetchCookie from 'fetch-cookie';
import fs from 'fs';
import querystring from 'querystring'; 

const url = 'http://kenyalaw.org/caselaw/cases/advanced_search_courts?court=190000';
const searchUrl = 'http://kenyalaw.org/caselaw/cases/advanced_search/';
const filePath = 'formPage.html'; 
const searchFilePath = 'searchPage.html';
const paginationBaseUrl = 'http://kenyalaw.org/caselaw/cases/advanced_search/page/';
const fetchCookie = makeFetchCookie(fetch);

const getFormPage = async () => {
    try {
        const headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Host': 'kenyalaw.org',
            'Pragma': 'no-cache',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        };

        const response = await fetchCookie(url, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        });

        const html = await response.text();
        fs.writeFileSync(filePath, html);
        console.log('HTML content saved to file:', filePath);
    } catch (error) {
        console.error('Error fetching form page:', error);
    }
};

const searchAndParseDate = async () => {
    try {
        await getFormPage();

        const headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Host': 'kenyalaw.org',
            'Pragma': 'no-cache',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        };

        const searchParams = querystring.stringify({ 
            date_to: '2022-01-31'
        });

        const response = await fetchCookie(`${searchUrl}?${searchParams}`, { 
            headers: headers,
            credentials: 'include'
        });

        const html = await response.text();
        fs.writeFileSync(searchFilePath, html);
        console.log('Search results saved to file:', searchFilePath);

        const totalPages = 5;
        for (let page = 1; page <= totalPages; page++) {
            const pageUrl = `${paginationBaseUrl}${page}/`;
            try {
                const pageResponse = await fetchCookie(pageUrl, {
                    method: 'GET',
                    headers: headers,
                    credentials: 'include'
                });

                if (pageResponse.ok) {
                    const pageHtml = await pageResponse.text();
                    const pageFilePath = `page_${page}.html`;
                    fs.writeFileSync(pageFilePath, pageHtml);
                    console.log(`Page ${page} content saved to file:`, pageFilePath);
                } else {
                    console.error('Error fetching page:', pageResponse.statusText);
                }
            } catch (error) {
                console.error('Error fetching page:', error);
            }
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};

searchAndParseDate();
