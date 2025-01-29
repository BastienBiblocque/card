const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à SQLite
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Erreur de connexion à la DB:', err.message);
    } else {
        console.log('Connexion réussie à SQLite');
    }
});

app.get('/cards', (req, res) => {
    db.all('SELECT id, name, language, lowest_price, recent_price, url FROM cards', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/add-card', (req, res) => {
    const { name, language, url } = req.body;
    
    if (!name || !language || !url) {
        return res.status(400).json({ error: "Tous les champs sont requis !" });
    }

    const query = `INSERT INTO cards (name, language, url, lowest_price, recent_price, date) VALUES (?, ?, ?, NULL, NULL, datetime('now'))`;

    db.run(query, [name, language, url], function(err) {
        if (err) {
            console.error('Erreur lors de l’insertion:', err.message);
            return res.status(500).json({ error: 'Problème lors de l’insertion' });
        }
        res.json({ message: "Carte ajoutée avec succès !", id: this.lastID });
    });
});


app.get('/run-script', (req, res) => {
    exec('node main.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur: ${error.message}`);
            return res.status(500).send('Erreur lors de l\'exécution du script');
        }
        console.log(`Résultat: ${stdout}`);
        res.send('Script exécuté avec succès !');
    });
});

app.delete('/cards/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM cards WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Carte non trouvée' });
            return;
        }
        res.json({ message: `Carte avec ID ${id} supprimée` });
    });
});

app.delete('/clear-prices', (req, res) => {
    db.run('UPDATE cards SET lowest_price = NULL, recent_price = NULL', function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Tous les prix ont été réinitialisés à NULL.' });
        }
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
