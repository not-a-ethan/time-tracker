import type { NextRequest, NextResponse } from 'next/server'
import { useSearchParams } from 'next/navigation'

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

import { isAuthenticated } from '../../../../../helpers/isAuthenticated'
import { userExists } from "../../../../../helpers/userExists";

import { sql } from "../../../../../utils/postgres"

export async function GET(req: NextRequest, res: NextResponse) {
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

    try {
        response = await sql`SELECT * FROM projects WHERE user_id = ${userID}`;
    } catch (e) {
        return new Response(
            JSON.stringify(
                { error: "Internal Server Error" }
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