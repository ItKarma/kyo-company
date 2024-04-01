import 'dotenv/config'
import { Bot } from "grammy";

const bot = new Bot(process.env.TOKEN);

export default bot