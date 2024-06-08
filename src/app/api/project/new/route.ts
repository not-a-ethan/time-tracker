import type { NextRequest, NextResponse } from 'next/server'
import { useSearchParams } from 'next/navigation'

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

import { sql } from "../../postgres"

export async function POST(req: NextRequest, res: NextResponse) {  
    const searchParamas = req.nextUrl.searchParams
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

    let userID = -1 
    
    try {
        const result = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
        userID = result[0].id
    } catch (error) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error" }
            ),
            { status: 500 }
        )
    }

    if (userID === -1) {
        return new Response(
            JSON.stringify(
                { error: "User not found" }
            ),
            { status: 404 }
        )
    }

    const slug = body["newProject"].replace(/ /g, "-").toLowerCase();

    if (slug === "") {
        return new Response(
            JSON.stringify(
                { error: "Project name cannot be empty" }
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

    if (projectExists.length > 0) {
        return new Response(
            JSON.stringify(
                { error: "Project already exists" }
            ),
            { status: 409 }
        )
    }
    
    let response;

    try {
        response = await sql`
            INSERT INTO projects (user_id, project_name, slug)
            VALUES
            (${userID},${body["newProject"]},${slug})
        `
    } catch (error) {
        return new Response(
            JSON.stringify(
                { error: "Something went wrong" }
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