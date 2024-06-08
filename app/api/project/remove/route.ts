import type { NextRequest, NextResponse } from 'next/server'
import { useSearchParams } from 'next/navigation'

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

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

    let userID: any = -1

    try {
        userID = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
    } catch (error) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error. Can not get user" }
            ),
            { status: 500 }
        )
    }

    userID = userID[0].id

    const slug = body["deleteSlug"]

    if (!slug || slug === "") {
        return new Response(
            JSON.stringify(
                { error: "No slug provided or is empty" }
            ),
            { status: 400 }
        )
    }

    let projectExists;
    
    try {
        projectExists = await sql`SELECT * FROM projects WHERE slug = ${slug} AND user_id = ${userID}`
    } catch (e) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error. Can not get project" }
            ),
            { status: 500 }
        )
    }

    if (projectExists.length === 0) {
        return new Response(
            JSON.stringify(
                { error: "Project not found" }
            ),
            { status: 404 }
        )
    }

    let timeResponse;

    try {
        timeResponse = await sql`DELETE FROM timeentries WHERE project_id = ${projectExists[0].id}`
    } catch (error) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error. Was not able to delete time entries" }
            ),
            { status: 500 }
        )
    }

    let response;

    try {
        response = await sql`DELETE FROM projects WHERE slug = ${slug} AND user_id = ${userID}`
    } catch (error) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error. Was not able to delete project" }
            ),
            { status: 500 }
        )
    }

    return new Response(
        JSON.stringify(
            { message: "Project deleted" }
        ),
        { status: 200 }
    )
}