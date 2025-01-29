const sqlite3 = require('sqlite3').verbose();

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Erreur lors de l ouverture de la base de données:', err.message);
    } else {
        console.log('Connexion réussie à SQLite');
        
        // Données de la carte à insérer
        const webhookData = {
            server: 'perso',
            channel: 'general',
            link: 'null',
        };

        // Insertion de la carte dans la table
        const query = `INSERT INTO webhook (server, channel, link) 
                       VALUES (?, ?, ?)`;

        db.run(query, [webhookData.server, webhookData.channel, webhookData.link], function(err) {
            if (err) {
                console.error('Erreur lors de l insertion de la carte:', err.message);
            } else {
                console.log(`Carte insérée avec succès avec l'ID ${this.lastID}`);
            }
            db.close();
        });
    }
});
