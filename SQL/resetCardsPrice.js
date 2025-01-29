const sqlite3 = require('sqlite3').verbose();

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('❌ Erreur lors de l\'ouverture de la base de données:', err.message);
        return;
    }

    console.log('✅ Connexion réussie à SQLite');

    // Requête pour mettre à jour tous les prix à NULL
    const query = `UPDATE cards SET lowest_price = NULL, recent_price = NULL`;

    db.run(query, function(err) {
        if (err) {
            console.error('❌ Erreur lors de la mise à jour des prix:', err.message);
        } else {
            console.log(`✅ Prix réinitialisés pour ${this.changes} cartes.`);
        }
        db.close();
    });
});
