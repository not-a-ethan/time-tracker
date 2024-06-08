import type { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../pages/api/auth/[...nextauth]"

import { sql } from "../../postgres"

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();

    const session: any = await getServerSession(authOptions)
    const externalID = session.token.sub

    if (!session) {
        // Not Signed in
        return new Response(
            JSON.stringify(
                { error: "You must be signed in to do that" }
            ),
            { status: 401 }
        )
    }

    let userID = -1;

    try {
        const user = await sql`SELECT * FROM users WHERE external_id = ${externalID}`;
        userID = user[0].id;
    } catch (e) {
        return new Response(
            JSON.stringify(
                { error: "Internal Server Error" }
            ),
            { status: 500 }
        )
    }

    if (userID === -1) {
        return new Response(
            JSON.stringify(
                { error: "Internal Server Error" }
            ),
            { status: 500 }
        )
    }

    if (typeof body["id"] !== "number") {
        return new Response(
            JSON.stringify(
                { error: "ID must be a number" }
            ),
            { status: 400 }
        )
    }

    let dbEntry;

    try {
        dbEntry = await sql`SELECT * FROM timeentries WHERE id = ${body["id"]} AND user_id = ${userID}`;
    } catch (e) {
        return new Response(
            JSON.stringify(
                { error: "Internal Server Error" }
            ),
            { status: 500 }
        )
    }

    if (dbEntry.length === 0) {
        return new Response(
            JSON.stringify(
                { error: "Entry not found" }
            ),
            { status: 404 }
        )
    }

    dbEntry = dbEntry[0];

    let response;

    if (body["data"] === "name") {
        const slug = body["name"].replace(/ /g, "-").toLowerCase();

        if (slug === dbEntry.slug) {
            return new Response(
                JSON.stringify(
                    { error: "Thats already the name" }
                ),
                { status: 400 }
            )
        } else {
            let slugExists;

            try {
                slugExists = await sql`SELECT * FROM timeentries WHERE slug = ${slug} AND user_id = ${userID}`;
            } catch (e) {
                return new Response(
                    JSON.stringify(
                        { error: "Internal Server Error" }
                    ),
                    { status: 500 }
                )
            }

            if (slugExists.length > 0) {
                return new Response(
                    JSON.stringify(
                        { error: "Name already exists" }
                    ),
                    { status: 400 }
                )
           }
        }

        try {
            response = await sql`UPDATE timeentries SET name = ${body["name"]} AND slug = ${slug} WHERE id = ${body["id"]} AND user_id = ${userID}`;
        } catch (e) {
            return new Response(
                JSON.stringify(
                    { error: "Internal Server Error" }
                ),
                { status: 500 }
            )
        }
    } else if (body["data"] === "time") {
        const newSeconds = body["time"];

        if (typeof newSeconds !== "number") {
            return new Response(
                JSON.stringify(
                    { error: "time_seconds must be a number" }
                ),
                { status: 400 }
            )
        }

        if (newSeconds === dbEntry["time_seconds"]) {
            return new Response(
                JSON.stringify(
                    { error: "Thats already the time" }
                ),
                { status: 400 }
            )
        }

        try {
            response = await sql`UPDATE timeentries SET time_seconds = ${newSeconds} WHERE id = ${body["id"]} AND user_id = ${userID}`;
        } catch (e) {
            return new Response(
                JSON.stringify(
                    { error: "Internal Server Error" }
                ),
                { status: 500 }
            )
        }
    } else if (body["data"] === "project") {
        const newProjectID = body["project_id"];
        let projectExists;

        try {
            projectExists = await sql`SELECT * FROM projects WHERE id = ${newProjectID}`;
        } catch (e) {
            return new Response(
                JSON.stringify(
                    { error: "Internal Server Error" }
                ),
                { status: 500 }
            )
        }

        if (projectExists.length === 0) {
            return new Response(
                JSON.stringify(
                    { error: "Internal Server Error" }
                ),
                { status: 400 }
            )
        }

        if (newProjectID === dbEntry["project_id"]) {
            return new Response(
                JSON.stringify(
                    { error: "Thats already the project" }
                ),
                { status: 400 }
            )
        }

        try {
            response = await sql`UPDATE timeentries SET project_id = ${newProjectID} WHERE id = ${body["id"]} AND user_id = ${userID}`;
        } catch (e) {
            return new Response(
                JSON.stringify(
                    { error: "Internal Server Error" }
                ),
                { status: 500 }
            )
        }
    }
}