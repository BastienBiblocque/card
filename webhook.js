const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

// Connexion à la base de données
const db = new sqlite3.Database('data.db', (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données :', err.message);
    } else {
        console.log('Connexion à la base de données réussie.');
    }
});

// Fonction pour récupérer tous les webhooks
const getWebhooks = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT link FROM webhook`, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => row.link)); // Retourne un tableau d'URLs
            }
        });
    });
};

// Fonction pour envoyer un message à un webhook
const sendMessage = async (url, content) => {
    try {
        await axios.post(url, { content });
        console.log(`✅ Message envoyé à ${url}`);
    } catch (error) {
        console.error(`❌ Erreur lors de l'envoi du message à ${url} :`, error.message);
    }
};

// Fonction principale
const sendMessagesToAll = async (message) => {
    try {
        const webhooks = await getWebhooks();
        
        if (webhooks.length === 0) {
            console.log('⚠️ Aucun webhook trouvé dans la base de données.');
            return;
        }

        console.log(`🔄 Envoi d'un message à ${webhooks.length} webhooks...`);
        for (const url of webhooks) {
            await sendMessage(url, message);
        }
    } catch (error) {
        console.error('Erreur générale :', error);
    } finally {
        // db.close();
    }
};

// Exécuter le script
module.exports = sendMessagesToAll;
