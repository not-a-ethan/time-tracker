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

    if (method !== "DELETE") {
        res.status(418).json({ error: "Wrong method. Remember I am a Tea Pot" });
        return;
    }

    const session: any = await getServerSession(req, res, authOptions)
    const externalID = session.token.sub

    if (!session) {
        // Not Signed in
        res.status(401).json({ error: "You must be signed in to do that" });
        return;
    }

    const entryID = Number(body["id"])

    if (typeof entryID !== "number") {
        res.status(400).json({ error: "id must be a number" });
        return;
    } else if (entryID < 1) {
        res.status(400).json({ error: "id must be a positive number" });
        return;
    } else if (entryID % 1 !== 0) {
        res.status(400).json({ error: "id must be an integer" });
        return;
    }

    let userID = -1;

    try {
        const result = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
        userID = result[0].id;
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    if (userID === -1) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    let entryExists;

    try {
        entryExists = await sql`SELECT * FROM time WHERE id = ${body["id"]} AND user_id = ${userID})`
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    if (entryExists.length === 0) {
        res.status(404).json({ error: "Entry not found" });
        return;
    }

    try {
        await sql`DELETE FROM time WHERE id = ${body["id"]}`
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}