import type { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../pages/api/auth/[...nextauth]"

import { sql } from "../../postgres"

export async function DELETE(req: NextRequest, res: NextResponse) {
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

    const entryID = Number(body["id"])

    if (typeof entryID !== "number") {
        return new Response(
            JSON.stringify(
                { error: "id must be a number" }
            ),
            { status: 400 }
        )
    } else if (entryID < 1) {
        return new Response(
            JSON.stringify(
                { error: "id must be a positive number" }
            ),
            { status: 400 }
        )
    } else if (entryID % 1 !== 0) {
        return new Response(
            JSON.stringify(
                { error: "id must be an integer" }
            ),
            { status: 400 }
        )
    }

    let userID = -1;

    try {
        const result = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
        userID = result[0].id;
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
                { error: "Internal server error" }
            ),
            { status: 500 }
        )
    }

    let entryExists;

    try {
        entryExists = await sql`SELECT * FROM time WHERE id = ${body["id"]} AND user_id = ${userID})`
    } catch (error) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error" }
            ),
            { status: 500 }
        )
    }

    if (entryExists.length === 0) {
        return new Response(
            JSON.stringify(
                { error: "Entry not found" }
            ),
            { status: 404 }
        )
    }

    try {
        await sql`DELETE FROM time WHERE id = ${body["id"]}`
    } catch (error) {
        return new Response(
            JSON.stringify(
                { error: "Internal server error" }
            ),
            { status: 500 }
        )
    }
}