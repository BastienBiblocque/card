// node SQL/addCard.js --name="Deckbox Gromago" --language="Francais" --url="https://www.cardmarket.com/fr/Pokemon/Products/Deck-Boxes/Raging-Surf-Gholdengo-Flip-Deck-Box?language=2"

const sqlite3 = require('sqlite3').verbose();
const minimist = require('minimist');

// Récupération des arguments en ligne de commande
const args = minimist(process.argv.slice(2));

// Vérification des paramètres obligatoires
if (!args.name || !args.language || !args.url) {
    console.error('❌ Erreur : Vous devez spécifier --name, --language et --url.');
    process.exit(1);
}

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('❌ Erreur lors de l\'ouverture de la base de données:', err.message);
        return;
    }

    console.log('✅ Connexion réussie à SQLite');

    // Données de la carte à insérer
    const cardData = {
        lowest_price: null,
        recent_price: null,
        name: args.name,
        language: args.language,
        url: args.url,
        date: new Date().toISOString().split('T')[0], // Date actuelle au format YYYY-MM-DD
    };

    // Insertion de la carte dans la table
    const query = `INSERT INTO cards (lowest_price, recent_price, name, language, url, date) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [
        cardData.lowest_price, 
        cardData.recent_price, 
        cardData.name, 
        cardData.language, 
        cardData.url, 
        cardData.date
    ], function(err) {
        if (err) {
            console.error('❌ Erreur lors de l\'insertion de la carte:', err.message);
        } else {
            console.log(`✅ Carte insérée avec succès avec l'ID ${this.lastID}`);
        }
        db.close();
    });
});
