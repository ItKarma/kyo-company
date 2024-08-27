import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('data.db');


db.run('CREATE INDEX IF NOT EXISTS idx_url ON urls(url)');
db.run('CREATE INDEX IF NOT EXISTS idx_user ON urls(user)');

// Função para buscar URLs em uma tabela específica com ordenação aleatória
const searchUrlInTableRandom = (db, tableName, searchTerm, limit = 10) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${tableName} WHERE url LIKE ? ORDER BY RANDOM() LIMIT ?`, [`%${searchTerm}%`, limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const searchUrlAlternatedRandom = async (searchTerm, limit = 10) => {
    try {
        const limitPerTable = Math.ceil(limit / 2);

        const [results1, results2] = await Promise.all([
            searchUrlInTableRandom(db, 'urls_part1', searchTerm, limitPerTable),
            searchUrlInTableRandom(db, 'urls_part2', searchTerm, limitPerTable)
        ]);

        // Combina os resultados das duas tabelas e remove duplicatas
        const combinedResults = [...results1, ...results2];
        const uniqueResults = Array.from(new Set(combinedResults.map(item => item.id)))
            .map(id => {
                return combinedResults.find(item => item.id === id);
            });

        // Limita o número total de resultados retornados
        return uniqueResults.slice(0, limit);
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};


const searchUrlRandom = (searchTerm, limit = 10) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM urls WHERE url LIKE ? ORDER BY RANDOM() LIMIT ?', [`%${searchTerm}%`, limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getRandomItem = (array) => {
    if (array.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};


async function getResults(url) {
    try {
        let results = await searchUrlRandom(url);

        return getRandomItem(results || null)
    } catch (error) {
        console.error(error);
    }
}


const searchUser = (searchTerm) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM urls WHERE user LIKE ? LIMIT 1000', [`%${searchTerm}%`], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};


async function getResultsUser(url) {
    try {
        let results = await searchUser(url);
        return results
    } catch (error) {
        console.error(error);
    }
}


async function getAllResults(url) {
    try {
        return await searchUrlAlternatedRandom(url);
    } catch (error) {
        console.error(error);
    }
}


const countUsersForUrl = (searchTerm) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) AS userCount FROM urls WHERE url LIKE ?', [`%${searchTerm}%`], (err, row) => {
            if (err) {
                console.error('Query Error:', err);
                reject(err);
            } else {
                resolve(row.userCount);
            }
        });
    });
};


const countUsersByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) AS userCount FROM urls WHERE user = ?', [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.userCount);
            }
        });
    });
};


const countTotalUsers = () => {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) AS totalUsers FROM urls', (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.totalUsers);
            }
        });
    });
};

export { countUsersForUrl, countUsersByUsername, getAllResults, getResults, countTotalUsers, getResultsUser };
