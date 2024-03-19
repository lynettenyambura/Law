import fetch from 'node-fetch';
import makeFetchCookie from 'fetch-cookie';
import fs from 'fs';

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
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'kenyalaw.org',
            'Origin': 'http://kenyalaw.org',
            'Pragma': 'no-cache',
            'Referer': 'http://kenyalaw.org/caselaw/cases/advanced_search_courts?court=190000',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        };

        const searchParams = new URLSearchParams();
        searchParams.append('content', '');
        searchParams.append('subject', '');
        searchParams.append('case_number', '');
        searchParams.append('parties', '');
        searchParams.append('court[]', '190000');
        searchParams.append('date_from', '2022-01-01');
        searchParams.append('date_to', '2022-01-31');
        searchParams.append('submit', 'Search');

        const response = await fetchCookie(searchUrl, {
            method: 'POST',
            headers: headers,
            body: searchParams,
            credentials: 'include'
        });

        const html = await response.text();
        fs.writeFileSync(searchFilePath, html);
        console.log('Search results saved to file:', searchFilePath);

        const paginate = async () => {
            const totalPages = 40;
            for (let page = 10; page <= totalPages; page += 10) {
                const pageUrl = `${paginationBaseUrl}/${page}/`;
                try {
                    const pageResponse = await fetchCookie(pageUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                            'Accept-Encoding': 'gzip, deflate',
                            'Accept-Language': 'en-US,en;q=0.9',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive',
                            'Cookie': '_gid=GA1.2.1841360343.1710683877; _ga=GA1.2.1357335161.1708850195; _ga_SCV6JN18JH=GS1.1.1710767592.5.0.1710767598.0.0.0; cisession=a%3A4%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%228ea635368552e5c4e0e694483a0f9696%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A15%3A%22192.168.100.101%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A111%3A%22Mozilla%2F5.0+%28Windows+NT+10.0%3B+Win64%3B+x64%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F122.0.0.0+Safari%2F537.36%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1710770964%3B%7Dc3c3e44b1875a846d3df2bffd7127c0e; _gat=1',
                            'Host': 'kenyalaw.org',
                            'Pragma': 'no-cache',
                            'Referer': 'http://kenyalaw.org/caselaw/cases/advanced_search_courts?court=190000',
                            'Upgrade-Insecure-Requests': '1',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                        },
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
        };
        paginate(); 
    } catch (error) {
        console.error('Error in searchAndParseDate:', error);
    }
};

searchAndParseDate(); 