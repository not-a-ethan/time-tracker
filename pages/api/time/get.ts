import type { NextApiRequest, NextApiResponse } from 'next'

import postgres from "postgres";

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

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

    if (method !== "GET") {
        res.status(418).json({ error: "Wrong method. Remember I am a Tea Pot" });
        return;
    }

    const session: any = await getServerSession(req, res, authOptions)
    const externalID = session.token.sub
    let userID = -1;

    if (!session) {
        // Not Signed in
        res.status(401).json({ error: "You must be signed in to do that" });
        return;
    }

    try {
        const user = await sql`SELECT * FROM users WHERE external_id = ${externalID}`;
        userID = user[0].id;
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

    let response;

    if (body["type"] === "total") {
        try {
            response = await sql`SELECT * FROM timeentries WHERE user_id = ${userID}`;
        } catch (e) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    } else if (body["type"] === "project") {
        let projectExists;

        try {
            projectExists = await sql`SELECT * FROM projects WHERE id = ${body["project_id"]}`;
        } catch (e) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        

        if (projectExists.length === 0) {
            res.status(400).json({ error: "Project does not exist" });
            return;
        }

        try {
            response = await sql`SELECT * FROM timeentries WHERE user_id = ${userID} AND project_id = ${body["project_id"]}`;
        } catch (e) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    } else if (body["type"] === "dataExact") {
        try {
            response = await sql`SELECT * FROM timeentries WHERE user_id = ${userID} AND DATE(time_added) = ${body["date"]}`;
        } catch (e) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    } else if (body["type"] === "dateRange") {
        try {
            response = await sql`SELECT * FROM time WHERE user_id = ${userID} AND DATE(time_added) >= ${body["start"]} AND DATE(time_added) <= ${body["end"]}`;
        } catch (e) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    } else if (body["type"] === "id") {
        try {
            response = await sql`SELECT * FROM timeentries WHERE user_id = ${userID} AND id = ${body["id"]}`;
        } catch (e) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    } else {
        res.status(400).json({ error: "Invalid type" });
        return;
    }

    res.status(200).json({ response });
}