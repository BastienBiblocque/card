const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('❌ Erreur lors de la connexion à SQLite:', err.message);
    } else {
        console.log('✅ Connexion réussie à SQLite');
    }
});

const getAllCards = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, url, lowest_price, name, language FROM cards WHERE url IS NOT NULL', (err, rows) => {
            if (err) {
                return reject('❌ Erreur récupération des cartes: ' + err.message);
            }
            resolve(rows);
        });
    });
};

const updateCardPrice = (id, newPrice, isLowest) => {
    return new Promise((resolve, reject) => {
        const query = isLowest
            ? `UPDATE cards SET lowest_price = ?, recent_price = ? WHERE id = ?`
            : `UPDATE cards SET recent_price = ? WHERE id = ?`;

        const params = isLowest ? [newPrice, newPrice, id] : [newPrice, id];

        db.run(query, params, function (err) {
            if (err) {
                return reject(`❌ Erreur mise à jour ID ${id}: ${err.message}`);
            }
            resolve(`✅ Prix mis à jour pour l'ID ${id}`);
        });
    });
};

module.exports = { getAllCards, updateCardPrice, db };
