import { NextRequest } from "next/server";
import { useSearchParams } from 'next/navigation'

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

import { sql } from "../../postgres"

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const session: any = await getServerSession(authOptions)
    const externalID: Number = session.token.sub

    if (session === null) {
        return new Response(
            JSON.stringify(
                { error: "You must be signed in to do that" }
            ),
            { status: 401 }
        )
    }

    let response;

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
                { error: "Internal server error" }
            ),
            { status: 500 }
        )
    }

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