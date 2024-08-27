import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = 'data.db';
const pastaDados = path.join(__dirname, '../db_urls');

let db = new sqlite3.Database(dbPath);

async function openDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(dbPath, async (err) => {
            if (err) reject(err);
            else {
                try {
                    await runQuery('PRAGMA synchronous = OFF');
                    await runQuery('PRAGMA journal_mode = WAL');
                    await runQuery('PRAGMA cache_size = 10000');
                    await runQuery('BEGIN TRANSACTION');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

async function closeDatabase() {
    return new Promise((resolve, reject) => {
        db.run('COMMIT', (err) => {
            if (err) reject(err);
            else {
                db.close((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            }
        });
    });
}

function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

async function importFile(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const batchSize = 10000;
    let batch = [];

    for await (const line of rl) {
        // Trata URL com 'https://' e separa corretamente
        const cleanedLine = line.startsWith('https://') ? line.slice(8) : line;
        const [url, user, pass] = cleanedLine.split(':');
        batch.push([url, user, pass]);

        if (batch.length >= batchSize) {
            const placeholders = batch.map(() => '(?, ?, ?)').join(',');
            const values = batch.flat();
            await runQuery(`INSERT INTO urls (url, user, pass) VALUES ${placeholders}`, values);
            batch = [];
        }
    }

    if (batch.length > 0) {
        const placeholders = batch.map(() => '(?, ?, ?)').join(',');
        const values = batch.flat();
        await runQuery(`INSERT INTO urls (url, user, pass) VALUES ${placeholders}`, values);
    }
}


async function deleteFile(filePath) {
    return fs.promises.unlink(filePath);
}

async function importAllFiles() {
    await openDatabase();
    const arquivos = await fs.promises.readdir(pastaDados);
    try {
        const importPromises = arquivos.map(async (arquivo) => {
            const filePath = path.join(pastaDados, arquivo);
            await importFile(filePath);
            await deleteFile(filePath);
        });
        await Promise.all(importPromises);
    } finally {
        await closeDatabase();
    }
}

export default importAllFiles;
