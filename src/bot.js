import 'dotenv/config'
import { Bot } from "grammy";
import connectToDatabase from "./db/connection.js";

await connectToDatabase();

const bot = new Bot(process.env.TOKEN);

export default bot