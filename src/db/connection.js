import "dotenv/config";
import { connect } from "mongoose";

export default async function connectToDatabase() {
    try {
        await connect(process.env.URL_DB);
        console.log("Connected to the database");
    } catch (err) {
        console.log("Error connecting to the database:", err);
    }
}