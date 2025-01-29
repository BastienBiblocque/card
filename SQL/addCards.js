const sqlite3 = require('sqlite3').verbose();

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Erreur lors de l ouverture de la base de données:', err.message);
    } else {
        console.log('Connexion réussie à SQLite');
        
        // Données de la carte à insérer
        const cardData = {
            name: 'Gromago',
            language: 'Anglais',
            url: 'https://www.cardmarket.com/fr/Pokemon/Products/Singles/Prismatic-Evolutions/Gholdengo-ex-PRE164?language=1',
        };

        // Insertion de la carte dans la table
        const query = `INSERT INTO cards (lowest_price, recent_price, name, language, url, date) 
                       VALUES (?, ?, ?, ?, ?, ?)`;

        db.run(query, [cardData.lowest_price, cardData.recent_price, cardData.name, cardData.language, cardData.url, cardData.date], function(err) {
            if (err) {
                console.error('Erreur lors de l insertion de la carte:', err.message);
            } else {
                console.log(`Carte insérée avec succès avec l'ID ${this.lastID}`);
            }
            db.close();
        });
    }
});
