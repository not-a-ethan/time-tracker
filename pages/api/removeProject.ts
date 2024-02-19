import type { NextApiRequest, NextApiResponse } from 'next'

import postgres from "postgres";

import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

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
    }

    const slug = body["slug"]

    const session: any = await getServerSession(req, res, authOptions)
    const externalID = session.token.sub

    let userID = -1

    try {
        userID = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
        return;
    }
    

    if (!session) {
        // Not Signed in
        res.status(401).json({ error: "You must be signed in to do that" });
        return;
    }

    const projectExists = await sql`SELECT * FROM projects WHERE slug = ${slug} AND user_id = ${userID}`

    if (projectExists.length === 0) {
        res.status(404).json({ error: "Project not found" });
        return;
    }

    let response

    try {
        response = await sql`DELETE FROM projects WHERE slug = ${slug} AND user_id = ${userID}`
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
        return;
    }

    res.status(200).json({ message: "Project deleted" })
    return;
}