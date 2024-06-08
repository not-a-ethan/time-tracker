import type { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../pages/api/auth/[...nextauth]"

import { sql } from "../../postgres"

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json()

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

    const time_seconds = Number(body["time_seconds"])

    if (typeof time_seconds !== "number") {
        return new Response(
            JSON.stringify(
                { error: "time_seconds must be a number" }
            ),
            { status: 400 }
        )
    } else if (time_seconds <= 0) {
        return new Response(
            JSON.stringify(
                { error: "time_seconds must be greater than 0" }
            ),
            { status: 400 }
        )
    }

    const slug = body["slug"]

    if (!slug || slug === "") {
        return new Response(
            JSON.stringify(
                { error: "slug cannot be empty" }
            ),
            { status: 400 }
        )
    }

    let projectID = -1;

    try {
        const result = await sql`SELECT id FROM projects WHERE slug = ${body["slug"]} AND user_id = (SELECT id FROM users WHERE external_id = ${externalID})`
        projectID = result[0].id
    } catch (e) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error. Couldnt get Project ID" }
            ),
            { status: 500 }
        )
    }

    let projectExists;

    try {
        projectExists = await sql`SELECT * FROM projects WHERE id = ${projectID} AND user_id = (SELECT id FROM users WHERE external_id = ${externalID})`
    } catch (error) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error. Couldnt get the project" }
            ),
            { status: 500 }
        )
    }

    if (projectExists.length === 0) {
        return new Response(
            JSON.stringify(
                { error: "Project doesnt exist" }
            ),
            { status: 404 }
        )
    }

    let userID = -1;

    try {
        const result = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
        userID = result[0].id
    } catch (error) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error. Couldnt get user ID" }
            ),
            { status: 500 }
        )
    }

    if (userID === -1) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error. Couldnt find user" }
            ),
            { status: 500 }
        )
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
        return new Response(
            JSON.stringify(
                { error: "Something went wrong when trying to add it to the DB" }
            ),
            { status: 500 }
        )
    }

    return new Response(
        JSON.stringify(
            response
        ),
        { status: 200 }
    )
}