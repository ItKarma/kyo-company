import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pastaDados = path.join(__dirname, '../db_urls');

// Função para criar o worker
function createWorker(arquivo, url) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
            workerData: { arquivo, url },
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}

// Código do worker, que será executado se o arquivo for executado como um worker
if (!isMainThread) {
    const { arquivo, url } = workerData;
    const caminhoArquivo = path.join(pastaDados, arquivo);

    async function workerTask() {
        try {
            console.log(`Memória usada: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);

            const resultados = [];
            const stream = fs.createReadStream(caminhoArquivo, { encoding: 'utf-8' });

            stream.on('data', (chunk) => {
                chunk.split('\n').forEach(linha => {
                    if (linha.includes(url)) {
                        resultados.push(linha);
                    }
                });
            });

            stream.on('end', () => {
                parentPort.postMessage(resultados);
            });

            stream.on('error', (err) => {
                parentPort.postMessage({ error: err.message });
            });
        } catch (err) {
            parentPort.postMessage({ error: err.message });
        }
    }

    workerTask();
}

export async function searchUrlInFiles(url) {
    const arquivos = await fs.promises.readdir(pastaDados);
    const resultados = [];

    // Limite de workers ativos
    const maxThreads = 4;
    let activeThreads = 0;

    for (const arquivo of arquivos) {
        if (activeThreads >= maxThreads) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        activeThreads++;
        createWorker(arquivo, url)
            .then((res) => {
                if (res.error) {
                    console.error(`Erro ao processar o arquivo ${arquivo}: ${res.error}`);
                } else {
                    resultados.push(...res);
                }
            })
            .finally(() => {
                activeThreads--;
            });
    }

    console.log(`Memória final: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`);
    while (activeThreads > 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return resultados;
}
