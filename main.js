const { getAllCards, db } = require('./database');
const { updateAllCards } = require('./scraper');

const start = async () => {
    try {
        const cards = await getAllCards();
        if (cards.length === 0) {
            console.log('⚠️ Aucune carte trouvée dans la base.');
            return;
        }
        await updateAllCards(cards);
    } catch (err) {
        console.error(err);
    } finally {
        db.close(); // Fermer la connexion à SQLite après exécution
    }
};

start();
