const sqlite3 = require('sqlite3').verbose();

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Erreur lors de l ouverture de la base de données:', err.message);
    } else {
        console.log('Connexion réussie à SQLite');
        db.run(`CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lowest_price REAL,
            recent_price REAL,
            name TEXT,
            language TEXT,
            url TEXT,
            date TEXT
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table:', err.message);
            } else {
                console.log('Table créée avec succès');
            }
            db.close();
        });
    }
});
