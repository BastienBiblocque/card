const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const sendMessagesToAll = require('./webhook.js');
const { updateCardPrice } = require('./database.js');

puppeteer.use(StealthPlugin());

const scrapePrice = async (url) => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'load', timeout: 10000 });

        const data = await page.evaluate(() => {
            const element = document.evaluate('/html/body/main/div[3]/section[5]/div/div[2]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            return element ? element.innerText : null;
        });

        await browser.close();

        if (!data) {
            console.log('⚠️ Aucun prix trouvé pour:', url);
            return null;
        }

        const match = data.match(/(\d+,\d+)\s?€/);
        return match ? match[1] : null;
    } catch (err) {
        console.error(`❌ Erreur scraping ${url}:`, err);
        await browser.close();
        return null;
    }
};

const updateAllCards = async (cards) => {
    for (const card of cards) {
        const newPrice = await scrapePrice(card.url);

        if (!newPrice) continue;

        const isLowerPrice = card.lowest_price === null || newPrice < card.lowest_price;

        await updateCardPrice(card.id, newPrice, isLowerPrice);

        const message = isLowerPrice
            ? `✅ Baisse de prix ! ${card.name} (${card.language}) : Ancien prix ${card.lowest_price}€ → Nouveau ${newPrice}€`
            : `❌ Pas de baisse de prix pour ${card.name} (${card.language}) : ${newPrice}€`;

        sendMessagesToAll(message);
    }
};

module.exports = { updateAllCards };
