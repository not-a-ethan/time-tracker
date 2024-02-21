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

    if (typeof body["time_seconds"] !== "number") {
        res.status(400).json({ error: "time_seconds must be a number" });
        return;
    }

    if (typeof body["project_id"] !== "number") {
        res.status(400).json({ error: "project_id must be a number" });
        return;
    }

    let projectExists;

    try {
        projectExists = await sql`SELECT * FROM projects WHERE id = ${body["project_id"]} AND user_id = (SELECT id FROM users WHERE external_id = ${externalID})`
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    let userID = -1;

    try {
        const result = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
        userID = result[0].id
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    if (userID === -1) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    const slug = body["name"].replace(/ /g, "-").toLowerCase();

    if (slug === "") {
        res.status(400).json({ error: "newProject cannot be empty" });
        return;
    }

    let response;

    try {
        const currentTime = new Date();
        response = sql`
        INSERT INTO timeentries
        VALUES 
        (${userID},${body["project_id"]},${body["name"]},${slug},${body["time_seconds"]},${currentTime})
        `
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
        return;
    }

    res.status(200).json({ response: response });
}