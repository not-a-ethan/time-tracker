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

    if (!session) {
        // Not Signed in
        res.status(401).json({ error: "You must be signed in to do that" });
        return;
    }

    let response;

    let userID = -1 

    try {
        const result = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
        userID = result[0].id
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
        return;
    }

    if (userID === -1) {
        res.status(500).json({ error: "Internal server error" })
        return;
    }

    let id, slug;

    if (query.type === "id") {
        id = query.id
        slug = undefined
        if (!id || id === "") {
            res.status(400).json({ error: "ID cannot be empty" })
            return;
        }
    } else if (query.type === "slug") {
        slug = query.slug
        id = undefined
        if (!slug || slug === "") {
            res.status(400).json({ error: "Slug cannot be empty" })
            return;
        }
    } else {
        res.status(400).json({ error: "Invalid query type" })
        return;
    }

    if (id) {
        try {
            response = await sql`SELECT * FROM projects WHERE user_id = ${userID} AND id = ${id}`
        } catch (error) {
            res.status(500).json({ error: "Internal server error" })
            return;
        }
    } else {
        try {
            response = await sql`SELECT * FROM projects WHERE user_id = ${userID} AND slug = ${slug}`
        } catch (error) {
            res.status(500).json({ error: "Internal server error" })
            return;
        }
    }

    if (response.length === 0) {
        res.status(404).json({ error: "Project not found" })
        return;
    }

    res.status(200).json(response)
    return;
}