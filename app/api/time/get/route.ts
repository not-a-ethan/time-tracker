import type { NextRequest, NextResponse } from 'next/server'
import { useSearchParams } from 'next/navigation'

import postgres from "postgres";

import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../pages/api/auth/[...nextauth]"

import { sql } from "../../postgres"

export async function GET(req: NextRequest, res: NextResponse) {
    const method = req.method;
    const searchParams = req.nextUrl.searchParams;

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
        let projectExists;

        try {
            projectExists = await sql`SELECT * FROM projects WHERE id = ${searchParams?.get("project_id")}`;
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
                    { error: "Project does not exist" }
                ),
                { status: 400 }
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