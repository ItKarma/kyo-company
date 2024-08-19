import axios from 'axios';
import * as cheerio from 'cheerio';


async function fetchDownloadLink(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const downloadLink = $('a.input.popsok').attr('href');

    //console.log('Download Link:', downloadLink);
    return downloadLink
  } catch (error) {
    console.error('Error fetching the HTML:', error);
  }
}

export default fetchDownloadLink