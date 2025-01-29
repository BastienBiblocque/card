// node SQL/addWebhook.js --server="perso" --channel="general" --link="https://discord.com/api/webhooks/123456"

const sqlite3 = require('sqlite3').verbose();
const minimist = require('minimist');

// Récupération des arguments en ligne de commande
const args = minimist(process.argv.slice(2));

// Vérification des paramètres obligatoires
if (!args.server || !args.channel || !args.link) {
    console.error('❌ Erreur : Vous devez spécifier --server, --channel et --link.');
    process.exit(1);
}

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('❌ Erreur lors de l\'ouverture de la base de données:', err.message);
        return;
    }

    console.log('✅ Connexion réussie à SQLite');

    // Données du webhook à insérer
    const webhookData = {
        server: args.server,
        channel: args.channel,
        link: args.link,
    };

    // Insertion dans la table webhook
    const query = `INSERT INTO webhook (server, channel, link) 
                   VALUES (?, ?, ?)`;

    db.run(query, [webhookData.server, webhookData.channel, webhookData.link], function(err) {
        if (err) {
            console.error('❌ Erreur lors de l\'insertion du webhook:', err.message);
        } else {
            console.log(`✅ Webhook inséré avec succès avec l'ID ${this.lastID}`);
        }
        db.close();
    });
});