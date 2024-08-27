import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPath = 'data.db';
let db;

// Abre o banco de dados e cria as tabelas e índices, se necessário
async function initializeDatabase() {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await createTable('urls');
    await createTable('urls_part1');
    await createTable('urls_part2');

    await createIndexes('urls');
}

// Cria a tabela se não existir
async function createTable(tableName) {
    await db.run(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            user TEXT,
            pass TEXT
        )
    `);
}

// Cria índices se não existirem
async function createIndexes(tableName) {
    await db.run(`CREATE INDEX IF NOT EXISTS idx_url_${tableName} ON ${tableName}(url)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_user_${tableName} ON ${tableName}(user)`);
}

// Função para buscar URLs em uma tabela específica com ordenação aleatória
const searchUrlInTableRandom = (tableName, searchTerm, limit = 10) => {
    return db.all(`SELECT * FROM ${tableName} WHERE url LIKE ? ORDER BY RANDOM() LIMIT ?`, [`%${searchTerm}%`, limit]);
};

const searchUrlUnlimite = (tableName, searchTerm ) => {
    return db.all(`SELECT * FROM ${tableName} WHERE url LIKE ? ORDER BY RANDOM() `, [`%${searchTerm}%`]);
};

// Função para buscar URLs em duas tabelas alternadamente com ordenação aleatória
const searchUrlAlternatedRandom = async (searchTerm, limit = 10) => {
    try {
        const limitPerTable = Math.ceil(limit / 2);

        const [results1, results2] = await Promise.all([
            searchUrlInTableRandom('urls_part1', searchTerm, limitPerTable),
            searchUrlInTableRandom('urls_part2', searchTerm, limitPerTable)
        ]);

        // Combina os resultados das duas tabelas e remove duplicatas
        const combinedResults = [...results1, ...results2];
        const uniqueResults = Array.from(new Set(combinedResults.map(item => item.id)))
            .map(id => combinedResults.find(item => item.id === id));

        // Limita o número total de resultados retornados
        return uniqueResults.slice(0, limit);
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};

// Função para buscar URLs com ordenação aleatória
const searchUrlRandom = (searchTerm, limit = 10) => {
    return db.all('SELECT * FROM urls WHERE url LIKE ? ORDER BY RANDOM() LIMIT ?', [`%${searchTerm}%`, limit]);
};

// Função para obter um item aleatório de um array
const getRandomItem = (array) => {
    if (array.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};

// Função para obter resultados de URL
const getResults = async (url) => {
    try {
        let results = await searchUrlRandom(url);
        return getRandomItem(results || []);
    } catch (error) {
        console.error(error);
    }
};

// Função para buscar usuários
const searchUser = (searchTerm) => {
    return db.all('SELECT * FROM urls WHERE user LIKE ? LIMIT 1000', [`%${searchTerm}%`]);
};

// Função para obter resultados de usuário
const getResultsUser = async (url) => {
    try {
        let results = await searchUser(url);
        return results;
    } catch (error) {
        console.error(error);
    }
};

// Função para obter todos os resultados de URL
const getAllResults = async (url) => {
    try {
        return await searchUrlUnlimite('urls',url);
    } catch (error) {
        console.error(error);
    }
};

// Função para contar usuários por URL
const countUsersForUrl = (searchTerm) => {
    return db.get('SELECT COUNT(*) AS userCount FROM urls WHERE url LIKE ?', [`%${searchTerm}%`])
        .then(row => row.userCount);
};

// Função para contar usuários por nome de usuário
const countUsersByUsername = (username) => {
    return db.get('SELECT COUNT(*) AS userCount FROM urls WHERE user = ?', [username])
        .then(row => row.userCount);
};

// Função para contar o total de usuários
const countTotalUsers = () => {
    return db.get('SELECT COUNT(*) AS totalUsers FROM urls')
        .then(row => row.totalUsers);
};

// Inicializa o banco de dados
initializeDatabase().catch(console.error);

export { countUsersForUrl, countUsersByUsername, getAllResults, getResults, countTotalUsers, getResultsUser };
