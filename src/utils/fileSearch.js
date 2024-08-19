import fs from 'fs';
import path, { dirname } from 'path';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));
const pastaDados = path.join(__dirname, '.././db_urls');

export async function searchUrlInFiles(url) {
    const arquivos = fs.readdirSync(pastaDados);
    const resultados = [];

    const promises = arquivos.map(arquivo => {
        return new Promise((resolve, reject) => {
            const caminhoArquivo = path.join(pastaDados, arquivo);
            const stream = createReadStream(caminhoArquivo, { encoding: 'utf-8' });
            let buffer = '';

            stream.on('data', chunk => {
                buffer += chunk;
                let linhas = buffer.split('\n');
                buffer = linhas.pop(); 

                linhas.forEach(linha => {
                    if (linha.includes(url)) {
                        resultados.push(linha);
                    }
                });
            });

            stream.on('end', () => {
                if (buffer.includes(url)) {
                    resultados.push(buffer);
                }
                resolve();
            });

            stream.on('error', reject);
        });
    });

    await Promise.all(promises);
    return resultados;
}
