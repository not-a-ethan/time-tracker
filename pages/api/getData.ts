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
    if (req.method !== "GET") {
        res.status(418).json({ error: "Wrong method. Remember I am a Tea Pot" });
        return;
    }

    const query = req.query;

    if (query["type"] === "time") {
        if (query["action"] === "total") {
            let totalTime: any = 0;
            try {
                totalTime = await sql`
                SELECT SUM(time_seconds) 
                FROM timeentries
                WHERE user_id = ${query["userID"]}
                `
            } catch (error) {
                res.status(500).json({ error: "Something went wrong" });
                return;
            }

            if (totalTime[0].sum == null) {
                res.status(200).json({ totalTime: 0 });
                return;
            }
            
            res.status(200).json({ totalTime: totalTime[0].sum });
            return;
        }

        if (query["action"] === "specific") {
            // get specific time entry
            return;
        }

        res.status(400).json({ error: "Invalid time action" });
        return;
    }

    if (query["type"] === "project") {
        if (query["action"] === "list") {
            let projects: any = [];

            try {
                projects = await sql`
                SELECT *
                FROM projects
                WHERE user_id = ${query["userID"]}
                `
            } catch (error) {
                res.status(500).json({ error: "Something went wrong" });
                return;
            }
            
            res.status(200).json({ projects: projects });
            return;
        }

        if (query["action"] === "single") {
            if (!query["projectID"]) {
                res.status(400).json({ error: "Invalid project ID" });
                return;
            }
            
            let projects: any = [];

            try {
                projects = await sql`
                SELECT *
                FROM projects
                WHERE user_id = ${query["userID"]} 
                AND slug = ${query["projectSlug"]}
                `
            } catch (error) {
                res.status(500).json({ error: "Something went wrong" });
                return;
            }

            res.status(200).json({ projects: projects });
            return;
        }

        res.status(400).json({ error: "Invalid project action" });
        return;
    }

    if (query["type"] === "user") {
        
    }

    res.status(400).json({ error: "Invalid query type" });
    return;
}