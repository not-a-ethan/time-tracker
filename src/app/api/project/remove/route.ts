import type { NextRequest, NextResponse } from 'next/server'
import { useSearchParams } from 'next/navigation'

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

import { isAuthenticated } from '../../../../../helpers/isAuthenticated'
import { userExists } from "../../../../../helpers/userExists";
import { doesProjectExists } from "../../../../../helpers/projectExists";
import { getProjectInfo } from '../../../../../helpers/projectInfo';

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
        console.log(userExists)
        return new Response(
            JSON.stringify(
                { error: "Internal Server Error" }
            ),
            { status: 500 }
        )
    } else {
        userID = userExistsVAR;
    }

    const slug = body["deleteSlug"]

    if (!slug || slug === "") {
        return new Response(
            JSON.stringify(
                { error: "No slug provided or is empty" }
            ),
            { status: 400 }
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

    const projectInfo: any = await getProjectInfo("slug", slug, NaN, userID)

    let deleteTimeEntries;

    try {
        deleteTimeEntries = await sql`DELETE FROM timeentries WHERE project_id = ${projectInfo[0].id}`
    } catch (error) {
        console.log(error)
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