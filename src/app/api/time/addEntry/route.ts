import type { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../pages/api/auth/[...nextauth]"

import { isAuthenticated } from '../../../../../helpers/isAuthenticated'
import { userExists } from "../../../../../helpers/userExists";
import { doesProjectExists } from "../../../../../helpers/projectExists";

import { sql } from "../../../../../utils/postgres"

interface projectExistsInterface {
    exists: Boolean,
    status: number,
    json: Object
}

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json()

    const session: any = await getServerSession(authOptions)
    const externalID = session.token.sub

    if (!isAuthenticated) {
        // Not Signed in
        return new Response(
            JSON.stringify(
                { error: "You must be signed in to do that" }
            ),
            { status: 401 }
        )
    }

    const userExistsVAR = await userExists(externalID)
    let userID = -1

    if (!userExistsVAR) {
        return new Response(
            JSON.stringify(
                { error: "Internal Server Error" }
            ),
            { status: 500 }
        )
    } else {
        userID = userExistsVAR;
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

    const projectExists: projectExistsInterface = await doesProjectExists("slug", slug, NaN, userID);

    if (!projectExists["exists"]) {
        return new Response(
            JSON.stringify(
                projectExists["json"]
            ),
            { status: projectExists["status"] }
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