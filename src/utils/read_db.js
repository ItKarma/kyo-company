import fs  from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const pastaDados = path.join(__dirname, '.././db_urls');

export default async function searchUrlInFiles(url) {
    const arquivos = fs.readdirSync(pastaDados);
    const resultados = [];

    for (const arquivo of arquivos) {
        const caminhoArquivo = path.join(pastaDados, arquivo);
        const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');

        // Verifica se o arquivo contém a URL procurada
        if (conteudo.includes(url)) {
            const linhas = conteudo.split('\n');
            for (const linha of linhas) {
                if (linha.includes(url)) {
                    resultados.push(linha);
                }
            }
        }
    }

    return resultados;
}


