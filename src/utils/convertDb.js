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

function openDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function closeDatabase() {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// Criação da tabela (se ainda não existir)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            user TEXT,
            pass TEXT
        )
    `);
});

function runQuery(query, params) {
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

    const batchSize = 10000; // Ajuste o tamanho do lote conforme necessário
    let batch = [];
    
    
    await runQuery('PRAGMA synchronous = OFF');
    await runQuery('PRAGMA journal_mode = WAL');
    await runQuery('BEGIN TRANSACTION'); 

    try {
        for await (const line of rl) {
            let http = '';
            let urlUserPass = '';
            
            if (line.includes("://")) {
                [http, urlUserPass] = line.split("://");
            } else {
                urlUserPass = line; 
            }
            
            const [url, user, pass] = urlUserPass.split(':');
            batch.push([url, user, pass]);

            if (batch.length >= batchSize) {
                const placeholders = batch.map(() => '(?, ?, ?)').join(', ');
                const flatBatch = batch.flat();
                await runQuery(`INSERT INTO urls (url, user, pass) VALUES ${placeholders}`, flatBatch);
                batch = []; 
            }
        }

        
        if (batch.length > 0) {
            const placeholders = batch.map(() => '(?, ?, ?)').join(', ');
            const flatBatch = batch.flat();
            await runQuery(`INSERT INTO urls (url, user, pass) VALUES ${placeholders}`, flatBatch);
        }
    } finally {
        await runQuery('COMMIT'); 
        await runQuery('PRAGMA synchronous = FULL');
        await runQuery('PRAGMA journal_mode = DELETE');
    }
}

async function deleteFile(filePath) {
    return fs.promises.unlink(filePath); 
}

async function importAllFiles() {
    await openDatabase(); 
    const arquivos = await fs.promises.readdir(pastaDados);
    try {
        for (const arquivo of arquivos) {
            const filePath = path.join(pastaDados, arquivo);
            await importFile(filePath);
            await deleteFile(filePath); 
        }
    } finally {
        await closeDatabase(); 
    }
}

export default importAllFiles;
