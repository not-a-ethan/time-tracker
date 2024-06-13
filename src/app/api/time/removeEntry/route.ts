import type { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../pages/api/auth/[...nextauth]"

import { isAuthenticated } from '../../../../../helpers/isAuthenticated'
import { userExists } from "../../../../../helpers/userExists";
import { doesTimeEntryExist } from '../../../../../helpers/timeEntryExists';

import { sql } from "../../../../../utils/postgres"

export async function DELETE(req: NextRequest, res: NextResponse) {
    const body = await req.json();

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

    const entryExists = await doesTimeEntryExist(body["id"], userID)

    if (entryExists.exists) {
        return new Response(
            JSON.stringify(
                entryExists["json"]
            ),
            { status: entryExists["status"] }
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