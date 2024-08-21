import fs from 'fs/promises';
import path from 'path';
import { parentPort } from 'worker_threads';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pastaDados = path.join(__dirname, '.././db_urls');

parentPort.on('message', async ({ arquivo, url }) => {
    const caminhoArquivo = path.join(pastaDados, arquivo);
    try {
        const conteudo = await fs.readFile(caminhoArquivo, 'utf-8');
        const resultados = conteudo.split('\n').filter(linha => linha.includes(url));
        parentPort.postMessage(resultados);
    } catch (err) {
        parentPort.postMessage({ error: err.message });
    }
});
