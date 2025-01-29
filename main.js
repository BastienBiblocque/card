const puppeteer = require('puppeteer');
const sqlite3 = require('sqlite3').verbose();


// Connexion à la base de données SQLite
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Erreur lors de l ouverture de la base de données:', err.message);
    } else {
        console.log('Connexion réussie à SQLite');
    }
});

// Fonction pour récupérer les URLs et mettre à jour les données
const updateCardData = async () => {
    // Récupérer les URLs dans la base de données
    db.all('SELECT id, url, lowest_price FROM cards WHERE url IS NOT NULL', async (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des URLs:', err.message);
            return;
        }

        // Lancer Puppeteer
        const browser = await puppeteer.launch({
            headless: true,  // Assure-toi que le mode headless est activé
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1280x1024']
        });
        
        for (const row of rows) {
            try {
                const page = await browser.newPage();

                await page.goto(row.url, { waitUntil: 'load', timeout: 10000 }); 
                await page.waitForSelector('body > main > div.page-title-container.d-flex.align-items-center.text-break > div.flex-grow-1 > h1', { visible: true, timeout: 10000 });  // Attendre que l'élément avec le prix soit visible


                // Récupérer le contenu de l'élément avec XPath donné
                const data = await page.evaluate(() => {
                    const element = document.evaluate('/html/body/main/div[3]/section[5]/div/div[2]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    return element ? element.innerText : 'Élément non trouvé';
                });

                const regex = /(\d+,\d+)\s?€/;
                const match = data.match(regex);

                if (match) {
                    const newPrice = match[1]; // Le prix se trouve dans le premier groupe de capture
                    console.log('Prix extrait :', newPrice);
                    // Mettre à jour la table avec les nouvelles données
                    if (row.lowest_price === null || newPrice < row.lowest_price) {
                        // Mettre à jour lowest_price et recent_price si le prix est plus bas
                        const updateQuery = `UPDATE cards SET lowest_price = ?, recent_price = ? WHERE id = ?`;
                        db.run(updateQuery, [newPrice, newPrice, row.id], function (err) {
                            if (err) {
                                console.error('Erreur lors de la mise à jour du lowest_price et recent_price pour l ID', row.id, ':', err.message);
                            } else {
                                console.log(`Prix le plus bas et prix récent mis à jour pour l'ID ${row.id}`);
                            }
                        });
                    } else {
                        // Si le prix n'est pas plus bas, on met à jour uniquement recent_price
                        const updateQuery = `UPDATE cards SET recent_price = ? WHERE id = ?`;
                        db.run(updateQuery, [newPrice, row.id], function (err) {
                            if (err) {
                                console.error('Erreur lors de la mise à jour du recent_price pour l ID', row.id, ':', err.message);
                            } else {
                                console.log(`Prix récent mis à jour pour l'ID ${row.id}`);
                            }
                        });
                    }
                } else {
                    console.log('Prix non trouvé');
                }



            } catch (err) {
                console.error('Erreur lors de la récupération des données pour l URL', row.url, ':', err);
            }
        }

        // Fermer le navigateur après traitement
        await browser.close();
    });
};

// Appeler la fonction pour démarrer le processus
updateCardData();
