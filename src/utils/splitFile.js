import fs from 'fs';
import path from 'path';

async function splitFile(filePath, maxLinesPerFile) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let partNumber = 1;
    let linesCount = 0;
    let currentPartStream;
    const fileBaseName = path.basename(filePath, path.extname(filePath));

    // Cria o primeiro arquivo de saída
    const createNewPart = () => {
        if (currentPartStream) {
            currentPartStream.end(); // Finaliza o stream do arquivo anterior
        }
        const newFilePath = path.join(path.dirname(filePath), `${fileBaseName}_part${partNumber}.txt`);
        currentPartStream = fs.createWriteStream(newFilePath);
        partNumber++;
        linesCount = 0;
    };

    createNewPart(); // Cria o primeiro arquivo de saída

    for await (const line of rl) {
        if (linesCount >= maxLinesPerFile) {
            createNewPart(); // Cria um novo arquivo de saída quando o limite de linhas é atingido
        }
        currentPartStream.write(line + '\n');
        linesCount++;
    }

    if (currentPartStream) {
        currentPartStream.end(); // Finaliza o último arquivo
    }
}

export default splitFile