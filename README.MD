# Projet de mise à jour de prix de cartes

## Créer la base de données

Créer le fichier data.db

Puis 
```bash
node SQL/createDB.js
```

## Ajouter une carte

Pour ajouter une carte, vous pouvez directement modifier la table via le script `SQL/addCard.js` qui permet d'ajouter des informations comme le nom, la langue et l'URL de la carte :

```bash
node SQL/addCard.js
```

Vous devrez fournir les détails de la carte à ajouter dans le script, comme l'URL de la page où vous souhaitez récupérer les prix.

## Lancer le script de mise à jour des prix

Le script `main.js` se charge de récupérer les prix de chaque carte enregistrée dans la base de données via **Puppeteer**. Il met à jour le prix récent (`recent_price`) et le prix le plus bas (`lowest_price`) si le prix actuel est plus bas.

Lancez-le avec cette commande :

```bash
node main.js
```

Ce script parcourt toutes les URLs enregistrées dans la base de données et met à jour les informations sur les prix.

```bash
Ouvrir la DB en CLI 

sqlite3 ./data.db
```

Truc utile :
- https://www.zenrows.com/blog/puppeteer-cloudflare-bypass#bypass-with-puppeteer-extra-plugin-stealth