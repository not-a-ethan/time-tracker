import type { NextApiRequest, NextApiResponse } from 'next'

import postgres from "postgres";

import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

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

    const session: any = await getServerSession(req, res, authOptions)
    const externalID = session.token.sub

    if (!session) {
        // Not Signed in
        res.status(401).json({ error: "You must be signed in to do that" });
        return;
    }

    let userID = -1;

    try {
        const user = await sql`SELECT * FROM users WHERE external_id = ${externalID}`;
        userID = user[0].id;
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

    if (userID === -1) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

    if (typeof body["id"] !== "number") {
        res.status(400).json({ error: "ID must be a number" });
        return;
    }

    let dbEntry;

    try {
        dbEntry = await sql`SELECT * FROM timeentries WHERE id = ${body["id"]} AND user_id = ${userID}`;
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

    if (dbEntry.length === 0) {
        res.status(404).json({ error: "Entry not found" });
        return;
    }

    dbEntry = dbEntry[0];

    let response;

    if (body["data"] === "name") {
        const slug = body["name"].replace(/ /g, "-").toLowerCase();

        if (slug === dbEntry.slug) {
            res.status(400).json({ error: "Thats already the name" });
            return;
        } else {
            let slugExists;

            try {
                slugExists = await sql`SELECT * FROM timeentries WHERE slug = ${slug} AND user_id = ${userID}`;
            } catch (e) {
                res.status(500).json({ error: "Internal Server Error" });
                return;
            }

            if (slugExists.length > 0) {
                res.status(400).json({ error: "Name already exists" });
                return;
           }
        }

        try {
            response = await sql`UPDATE timeentries SET name = ${body["name"]} AND slug = ${slug} WHERE id = ${body["id"]} AND user_id = ${userID}`;
        } catch (e) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    } else if (body["data"] === "time") {
        const newSeconds = body["time"];

        if (typeof newSeconds !== "number") {
            res.status(400).json({ error: "time_seconds must be a number" });
            return;
        }

        if (newSeconds === dbEntry["time_seconds"]) {
            res.status(400).json({ error: "Thats already the time" });
            return;
        }

        try {
            response = await sql`UPDATE timeentries SET time_seconds = ${newSeconds} WHERE id = ${body["id"]} AND user_id = ${userID}`;
        } catch (e) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    } else if (body["data"] === "project") {
        const newProjectID = body["project_id"];
        let projectExists;

        try {
            projectExists = await sql`SELECT * FROM projects WHERE id = ${newProjectID}`;
        } catch (e) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        if (projectExists.length === 0) {
            res.status(400).json({ error: "Project does not exist" });
            return;
        }

        if (newProjectID === dbEntry["project_id"]) {
            res.status(400).json({ error: "Thats already the project" });
            return;
        }

        try {
            response = await sql`UPDATE timeentries SET project_id = ${newProjectID} WHERE id = ${body["id"]} AND user_id = ${userID}`;
        } catch (e) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
    }
}