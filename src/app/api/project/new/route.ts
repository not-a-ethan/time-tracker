import type { NextRequest, NextResponse } from 'next/server'
import { useSearchParams } from 'next/navigation'

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

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

    const slug = body["newProject"].replace(/ /g, "-").toLowerCase();

    if (slug === "") {
        return new Response(
            JSON.stringify(
                { error: "Project name cannot be empty" }
            ),
            { status: 400 }
        )
    }

    const projectExists: projectExistsInterface = await doesProjectExists("slug", slug, NaN, userID);

    if (projectExists["exists"]) {
        return new Response(
            JSON.stringify(
                projectExists["json"]
            ),
            { status: projectExists["status"] }
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