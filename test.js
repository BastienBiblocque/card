const puppeteer = require('puppeteer');


// Fonction pour récupérer les URLs et mettre à jour les données
const updateCardData = async () => {

        const browser = await puppeteer.launch({
            headless: true,  // Assure-toi que le mode headless est activé
        });

        try {
            const page = await browser.newPage();

            await page.goto('https://www.cardmarket.com/fr/Pokemon/Products/Singles/Prismatic-Evolutions/Gholdengo-ex-PRE164?language=1', { waitUntil: 'load', timeout: 10000 }); 


            await page.waitForSelector('body', { visible: true });

            // Récupérer le HTML complet de la page
            const content = await page.content();
        
            // Afficher le contenu dans la console
            console.log(content);
            

        } catch (err) {
            console.error('Erreur lors de la récupération des données pour l URL:', err);
        }
    

    // Fermer le navigateur après traitement
    await browser.close();
            
};

// Appeler la fonction pour démarrer le processus
updateCardData();
