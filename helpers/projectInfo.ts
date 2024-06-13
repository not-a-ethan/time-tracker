import { sql } from "../utils/postgres"

export async function getProjectInfo(type: string, slug: string, id: Number, userId: Number) {
    if (type === "slug") {
        const project = await sql`SELECT * FROM projects WHERE user_id = ${userId} AND slug = ${slug}`

        return project
    } else if (type === "id") {
        const project = await sql`SELECT * FROM projects WHERE user_id = ${userId} AND id = ${id}`

        return project
    }

    return null
}