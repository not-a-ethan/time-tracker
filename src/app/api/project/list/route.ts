import type { NextRequest, NextResponse } from 'next/server'
import { useSearchParams } from 'next/navigation'

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

import { sql } from "../../postgres"

export async function GET(req: NextRequest, res: NextResponse) {
    const session: any = await getServerSession(authOptions)
    const external_id = session.token.sub

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
        const user = await sql`SELECT * FROM users WHERE external_id = ${external_id}`;
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