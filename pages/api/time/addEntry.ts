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

    const time_seconds = Number(body["time_seconds"])

    if (typeof time_seconds !== "number") {
        res.status(400).json({ error: "time_seconds must be a number" });
        return;
    } else if (time_seconds <= 0) {
        res.status(400).json({ error: "time_seconds must be greater than 0" });
        return;
    }

    const slug = body["slug"]

    if (!slug || slug === "") {
        res.status(400).json({ error: "slug cannot be empty" });
        return;
    }

    let projectID = -1;

    try {
        const result = await sql`SELECT id FROM projects WHERE slug = ${body["slug"]} AND user_id = (SELECT id FROM users WHERE external_id = ${externalID})`
        projectID = result[0].id
    } catch (e) {
        res.status(500).json({ error: "Internal server error. Couldnt get Project ID" });
        return;
    }

    let projectExists;

    try {
        projectExists = await sql`SELECT * FROM projects WHERE id = ${projectID} AND user_id = (SELECT id FROM users WHERE external_id = ${externalID})`
    } catch (error) {
        res.status(500).json({ error: "Internal server error. Couldnt get the project" });
        return;
    }

    if (projectExists.length === 0) {
        res.status(404).json({ error: "Project doesnt exist" });
        return;
    }

    let userID = -1;

    try {
        const result = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
        userID = result[0].id
    } catch (error) {
        res.status(500).json({ error: "Internal server error. Couldnt get user ID" });
        return;
    }

    if (userID === -1) {
        res.status(500).json({ error: "Internal server error. Couldnt find user" });
        return;
    }

    let response;

    try {
        const currentTime = new Date();
        response = await sql`
        INSERT INTO timeentries (user_id, project_id, entry_name, slug, time_seconds, time_added)
        VALUES 
        (${userID},${projectID},${body["entryName"]},${slug},${body["time_seconds"]},${currentTime})
        `
    } catch (error) {
        res.status(500).json({ error: "Something went wrong when trying to add it to the DB" });
        return;
    }

    res.status(200).json({ response: response });
}