import type { NextApiRequest, NextApiResponse } from 'next'
import postgres from "postgres";

const sql: any = postgres({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    const query = req.query;
    const body = req.body;

    if (method !== "POST") {
        res.status(418).json({ error: "Wrong method. Remember I am a Tea Pot" });
        return;
    }

    // checks if user exists

    let response;

    try {
        const currentTime = new Date();
        response = sql`
        INSERT INTO timeentries
        VALUES 
        (${body["userID"]},${body["project_id"]},${body["name"]},${body["slug"]},${body["time_seconds"]},${currentTime})
        `
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
        return;
    }

    res.status(200).json({ response: response });
}