import { NextRequest } from "next/server";
import { useSearchParams } from 'next/navigation'

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

import { isAuthenticated } from '../../../../../helpers/isAuthenticated'
import { userExists } from "../../../../../helpers/userExists";

import { sql } from "../../../../../utils/postgres"

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const session: any = await getServerSession(authOptions)
    const externalID: Number = session.token.sub

    if (!isAuthenticated) {
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

    let id, slug;

    if (searchParams?.get("type") === "id") {
        id = searchParams?.get("id")
        slug = undefined

        if (!id || id === "") {
            return new Response(
                JSON.stringify(
                    { error: "ID cannot be empty" }
                ),
                { status: 400 }
            )
        }
    } else if (searchParams?.get("type") === "slug") {
        slug = searchParams.get("slug")
        id = undefined
        if (!slug || slug === "") {
            return new Response(
                JSON.stringify(
                    { error: "Slug cannot be empty" }
                ),
                { status: 400 }
            )
        }
    } else {
        return new Response(
            JSON.stringify(
                { error: "Invalid query type" }
            ),
            { status: 400 }
        )
    }

    if (id) {
        try {
            response = await sql`SELECT * FROM projects WHERE user_id = ${userID} AND id = ${id}`
        } catch (error) {
            return new Response(
                JSON.stringify(
                    { error: "Internal server error" }
                ),
                { status: 500}
            )
        }
    } else {
        try {
            response = await sql`SELECT * FROM projects WHERE user_id = ${userID} AND slug = ${slug}`
        } catch (error) {
            return new Response(
                JSON.stringify(
                    { error: "Internal server error" }
                ),
                { status: 404 }
            )
        }
    }

    if (response.length === 0) {
        return new Response(
            JSON.stringify(
                { error: "Project not found" }
            ),
            { status: 404 }
        )
    }

    return new Response(
        JSON.stringify(
            response
        ),
        { status: 200 }
    )
}