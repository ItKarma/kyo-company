import fs  from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const folder = path.join(__dirname, '.././db_urls');

async function getAllFiles(folder) {
    try {

        if (!fs.existsSync(folder)) {
            throw new Error(`Diretório não encontrado: ${folder}`);
        }

        const files = await fs.promises.readdir(folder);
        const filesWithPath = files.map(f => path.join(folder, f));
        const sizes = await Promise.all(filesWithPath.map(getFileSize));
        return sizes.reduce((sum, val) => sum + val, 0);
    } catch (err) {
        console.error('Erro ao ler diretório:', err);
        throw err;
    }
}

async function getFileSize(file) {
    try {
        const stat = await fs.promises.stat(file);
        if (stat.isDirectory()) {
            return getAllFiles(file);
        } else {
            return stat.size;
        }
    } catch (err) {
        console.error('Erro ao obter tamanho do arquivo:', err);
        throw err;
    }
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} Bytes`;
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed()} KB`;
    else if (bytes < 1073741824) return `${(bytes / 1048576).toFixed()} MB`;
    else return `${(bytes / 1073741824).toFixed()} GB`;
}

export async function getFolderSize() {
    try {
        const sum = await getAllFiles(folder);
        return formatBytes(sum);
    } catch (err) {
        console.error('Erro ao calcular o tamanho da diretoria:', err);
        throw err;
    }
}
