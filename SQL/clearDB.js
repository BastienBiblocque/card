const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('❌ Erreur lors de l\'ouverture de la base de données:', err.message);
        return;
    }

    console.log('✅ Connexion réussie à SQLite');

    // Récupérer toutes les tables de la base de données
    db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`, (err, tables) => {
        if (err) {
            console.error('❌ Erreur lors de la récupération des tables:', err.message);
            db.close();
            return;
        }

        if (tables.length === 0) {
            console.log('ℹ️ Aucune table trouvée.');
            db.close();
            return;
        }

        // Vider chaque table
        tables.forEach((table, index) => {
            db.run(`DELETE FROM ${table.name}`, function(err) {
                if (err) {
                    console.error(`❌ Erreur lors de la suppression des données de ${table.name}:`, err.message);
                } else {
                    console.log(`✅ Données de la table "${table.name}" supprimées.`);
                }

                // Fermer la base après la dernière suppression
                if (index === tables.length - 1) {
                    db.close();
                }
            });
        });
    });
});
