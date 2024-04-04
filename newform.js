import fetch from 'node-fetch';
import makeFetchCookie from 'fetch-cookie';
import fs from 'fs';
import cheerio from 'cheerio';

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
            
        });

        const html = await response.text();
        fs.writeFileSync(searchFilePath, html);
        console.log('Search results saved to file:', searchFilePath);

        const paginate = async () => {
            
            for (let page = 10; page <= 50; page += 10) {
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
                           'Host': 'kenyalaw.org',
                            'Pragma': 'no-cache',
                            'Referer': 'http://kenyalaw.org/caselaw/cases/advanced_search_courts?court=190000',
                            'Upgrade-Insecure-Requests': '1',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                        },
                        
                    });
        
                    if (pageResponse.status === 200) {
                        const pageHtml = await pageResponse.text();
                        const pageFilePath = `page_${page}.html`;
                        fs.writeFileSync(pageFilePath, pageHtml);
                        //await fs.promises.writeFile(pageFilePath, pageHtml);
                        console.log(`Page ${page} content saved to file:`, pageFilePath);
                    } else {
                        console.error('Error fetching page:', pageResponse.statusText);
                    }
                } catch (error) {
                     console.error('Error fetching page:', error);
                }
            }
        };
       await paginate();
    } catch (error) {
        console.error('Error in searchAndParseDate:', error);
    }
};

// function to download the pdf file
const downloadPDF = async (pdfUrl, caseId, pdfs) => {
    try {
    const response = await fetchCookie(pdfUrl, {
        method: 'GET',
        headers: {
            'authority': 'kenyalaw.org',
           'scheme': 'https',
           'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Referer': 'https://kenyalaw.org/caselaw/cases/view/227586/',
            'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': 'Android',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36'

        },
        credentials: 'same-origin'
    });
    if (response.status === 200) {
        const pdfData = await response.buffer(); 
        const pdfFileName = `pdfs/${caseId}.pdf`; 
        fs.writeFileSync(pdfFileName, pdfData); 
        console.log(`PDF file saved: ${pdfFileName}`);
    } else {
        console.error('Error downloading PDF:', response.statusText);
    }
} catch (error) {
    console.error('Error downloading PDF:', error);
}
}
// parsing results to click readmore for each case/document
const readmore = async () => {
    try {
    const urls = [];
    const totalPages = 50;
    for (let page = 10; page <= 50; page += 10) {
        const pageFilePath = `page_${page}.html`;
        const pageHtml = await fs.promises.readFile(pageFilePath, 'utf8');
        
        const $= cheerio.load(pageHtml);
        $('.post').each( function() {
            const href = $(this).find('.show-more').attr('href');
            if (href && href.includes('/caselaw/cases/view/')) {
                
                urls.push(href);
            }
        });
    };
   
    await fs.promises.writeFile('urls.json',JSON.stringify(urls,null,2))
    //await metaData(urls);
    for(const url of urls) {
        const pageUrl = await url
       const id = pageUrl.split('/')[6];
       console.log('Fetching case:', id);
       const response = await fetchCookie(pageUrl, {
        method: 'GET',
            headers: {
                'authority': 'kenyalaw.org',
                'scheme': 'https',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Referer': 'https://kenyalaw.org/caselaw/cases/advanced_search/',
                'Sec-Ch-Ua':' "Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': "Windows",
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            },
            credentials: 'same-origin'
 
        }); 
            if (response.status === 200) {
                const html = await response.text();
                const caseFilePath = `${id}.html`;
                await fs.promises.writeFile(`./links/${caseFilePath}`, html);
                console.log('Case content saved to file:', caseFilePath);

                // Fetch pdf and save it
                const pdfUrl = `https://kenyalaw.org/caselaw/cases/export/${id}/pdf`;
                downloadPDF(pdfUrl, id);

                // parse metadata and save it
                await metaData([id]);  
            } else {
                console.error('Error fetching case:', response.statusText);
            }
        }
        
    } catch (error) {
        console.error('Error in readmore:', error);
    }
};

// parsing metadata for each case/document
const metaData = async (ids) => {
    try {
        const allMetadata = [];

        for (const id of ids) {
            const caseFilePath = `./links/${id}.html`;
            const caseHtml = await fs.promises.readFile(caseFilePath, 'utf8');
            const $ = cheerio.load(caseHtml);

            const metadataTable = $('.meta_info');
            const metadataRows = metadataTable.find('tr');

            const metadata = {};
            metadataRows.each((index, element) => {
                const key = $(element).find('th').text().trim();
                const value = $(element).find('td').text().trim();
                metadata[key] = value;
            });

            allMetadata.push(metadata);
        }
        let existingMetadata = [];
        try {
            const existingMetadataJson = await fs.promises.readFile('metaData.json', 'utf8');
            existingMetadata = JSON.parse(existingMetadataJson);
        } catch (error) {

        }
        const updatedMetadata = existingMetadata.concat(allMetadata);
        await fs.promises.writeFile('metaData.json', JSON.stringify(updatedMetadata, null, 2));
        console.log('Metadata saved to file: metaData.json');
    } catch (error) {
        console.error('Error in metaData:', error);
    }
};

        









const main = async () => {
    try {
        await searchAndParseDate();
        await readmore();
         process.exit(0); 
    } catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
};

main();
//searchAndParseDate();
//readmore()
