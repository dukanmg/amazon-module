const { chromium } = require('playwright');




// Scrape Amazon product details
async function getAmazonProductDetails(page, url,platform) {
    try {
        await page.goto(url);

        const priceSelector = "#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative";
        await page.waitForSelector(priceSelector, { timeout: 60000 });

        const price = (await page.$eval(priceSelector, el => el.innerText)).trim() || "Price not available";

        return { url, platform: platform, price, offers: "Not implemented"};
    } catch (error) {
        return { url, error: `Amazon Scraping Error: ${error.message}` };
    }
}

// Scrape product details based on platform
async function scrapeProduct(browser, url, platform) {
    const page = await browser.newPage();
    let result;
    result = await getAmazonProductDetails(page, url,platform);

    await page.close();
    return [result];
}

// Scrape all products concurrently
async function scrapeAllProducts(url,platform) {
    const browser = await chromium.launch({ headless: true, args: ['--disable-gpu','--disable-blink-features=AutomationControlled'] });
    
    const tasks = await scrapeProduct(browser, url, platform)
    const results = await Promise.all(tasks);
    
    await browser.close();
    return results;
}

// API endpoint
module.exports.amazonlivedatabyurl=async(req,res)=>{
    let url = req.body.url;
    let platform = "Amazon"

    if (!url) 
    {
        return res.status(400).json({ error: "Collection is required and must be a valid object" });
    }
    try
    {
        
        let result = await scrapeAllProducts(url,platform)
        if(result)
        {
            console.log("Amazon extracted data result: ",result)
            return res.status(200).json({
                status:"success",
                statusCode:200,
                message:"Amazon data got the extracted",
                data:result
            })
        }
        else        
        {
            return res.status(200).json({
                status:"error",
                statusCode:400,
                message:"Amazon data not extracted",
                data:[]
            })
        }
    }
    catch(error)
    {
        console.log("Amazon scrapper --> amazonlivedatabyurl()  error : ",error)
    }
}
