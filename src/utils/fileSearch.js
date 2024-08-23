import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('data.db');

const searchUrl = (searchTerm) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM urls WHERE url LIKE ?', [`%${searchTerm}%`], (err, rows) => {
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
        let results = await searchUrl(url)
        const randomResult = getRandomItem(results);
        if (randomResult) {
            return randomResult
        }

        return

    } catch (error) {
        console.log(error)
    }

}

async function getAllResults(url) {
    try {

        let results = await searchUrl(url)
        if (results) {
            return results
        }

        return
    } catch (error) {
        console.log(error)
    }

}

const countUsersForUrl = (searchTerm) => {
    return new Promise((resolve, reject) => {
    //    console.log('Searching for:', searchTerm); // Verifique o valor de searchTerm
        db.get('SELECT COUNT(*) AS userCount FROM urls WHERE url LIKE ?', [`%${searchTerm}%`], (err, row) => {
            if (err) {
                console.error('Query Error:', err);
                reject(err);
            } else {
               // console.log('Query Result:', row); // Verifique o resultado da consulta
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


export { countUsersForUrl, countUsersByUsername, getAllResults, getResults, countTotalUsers }