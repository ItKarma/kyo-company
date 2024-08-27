import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('data.db');


db.run('CREATE INDEX IF NOT EXISTS idx_url ON urls(url)');
db.run('CREATE INDEX IF NOT EXISTS idx_user ON urls(user)');


const searchUrlPaginated = (searchTerm, limit = 10, offset = 0) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM urls WHERE url LIKE ? LIMIT ? OFFSET ?', [`%${searchTerm}%`, limit, offset], (err, rows) => {
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
        let results = await searchUrlPaginated(url);
        return getRandomItem(results) || null;
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
        return await searchUrlPaginated(url);
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
