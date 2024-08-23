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

// Função para importar um arquivo para o banco de dados
async function importFile(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const batchSize = 1000; // Número de linhas por lote
    let batch = [];
    
    await runQuery('BEGIN TRANSACTION'); // Inicia a transação

    try {
        for await (const line of rl) {
            let http = '';
            let urlUserPass = '';
            
            if (line.includes("://")) {
                [http, urlUserPass] = line.split("://");
            } else {
                urlUserPass = line; // Se não tiver "://", 
            }
            
            const [url, user, pass] = urlUserPass.split(':');
          //  console.log(url, user, pass);
            batch.push([url, user, pass]);


            if (batch.length >= batchSize) {
                const placeholders = batch.map(() => '(?, ?, ?)').join(', ');
                const flatBatch = batch.flat();
                await runQuery(`INSERT INTO urls (url, user, pass) VALUES ${placeholders}`, flatBatch);
                batch = []; // Limpa o lote
            }
        }

        // Insere o restante do lote se houver
        if (batch.length > 0) {
            const placeholders = batch.map(() => '(?, ?, ?)').join(', ');
            const flatBatch = batch.flat();
            await runQuery(`INSERT INTO urls (url, user, pass) VALUES ${placeholders}`, flatBatch);
        }
    } finally {
        await runQuery('COMMIT'); // Comita a transação
    }
}



async function deleteFile(filePath) {
    return fs.promises.unlink(filePath); // Remove o arquivo
}

async function importAllFiles() {
    await openDatabase(); // Reabre o banco de dados
    const arquivos = await fs.promises.readdir(pastaDados);
    try {
        for (const arquivo of arquivos) {
            const filePath = path.join(pastaDados, arquivo);
            await importFile(filePath);
            await deleteFile(filePath); // Exclui o arquivo após a importação
        }
    } finally {
        await closeDatabase(); // Garante que o banco de dados seja fechado após todas as operações
    }
}

export default importAllFiles;