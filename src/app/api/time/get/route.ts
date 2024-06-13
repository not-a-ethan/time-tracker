import type { NextRequest, NextResponse } from 'next/server'
import { useSearchParams } from 'next/navigation'

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

export async function GET(req: NextRequest, res: NextResponse) {
    const searchParams = req.nextUrl.searchParams;

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

    let response;

    if (searchParams?.get("type") === "total") {
        try {
            response = await sql`SELECT * FROM timeentries WHERE user_id = ${userID}`;
        } catch (e) {
            return new Response(
                JSON.stringify(
                    { error: "Internal Server Error" }
                ),
                { status: 500 }
            )
        }
    } else if (searchParams?.get("type") === "project") {
        const projectIdGet = Number(searchParams?.get("project_id"))
        let projectID: Number

        if (typeof projectIdGet === "number") {
            projectID = projectIdGet
        } else {
            return new Response(
                JSON.stringify(
                    { error: "Project ID is not a Number"}
                ),
                { status: 400 }
            )
        }

        const projectExists: projectExistsInterface = await doesProjectExists("id", "", projectID, userID);

        if (projectExists["exists"]) {
            return new Response(
                JSON.stringify(
                    projectExists["json"]
                ),
                { status: projectExists["status"] }
            )
        }

        try {
            response = await sql`SELECT * FROM timeentries WHERE user_id = ${userID} AND project_id = ${searchParams?.get("project_id")}`;
        } catch (e) {
            return new Response(
                JSON.stringify(
                    { error: "Internal Server Error" }
                ),
                { status: 500 }
            )
        }
    } else if (searchParams?.get("type") === "dataExact") {
        try {
            response = await sql`SELECT * FROM timeentries WHERE user_id = ${userID} AND DATE(time_added) = ${searchParams?.get("date")}`;
        } catch (e) {
            return new Response(
                JSON.stringify(
                    { error: "Internal Server Error" }
                ),
                { status: 500 }
            )
        }
    } else if (searchParams?.get("type") === "dateRange") {
        try {
            response = await sql`SELECT * FROM time WHERE user_id = ${userID} AND DATE(time_added) >= ${searchParams?.get("start")} AND DATE(time_added) <= ${searchParams?.get("end")}`;
        } catch (e) {
            return new Response(
                JSON.stringify(
                    { error: "Internal Server Error" }
                ),
                { status: 500 }
            )
        }
    } else if (searchParams?.get("type") === "id") {
        try {
            response = await sql`SELECT * FROM timeentries WHERE user_id = ${userID} AND id = ${searchParams?.get("id")}`;
        } catch (e) {
            return new Response(
                JSON.stringify(
                    { error: "Internal Server Error" }
                ),
                { status: 500 }
            )
        }
    } else {
        return new Response(
            JSON.stringify(
                { error: "Invalid type" }
            ),
            { status: 400 }
        )
    }

    return new Response(
        JSON.stringify(
            response
        ),
        { status: 200 }
    )
}