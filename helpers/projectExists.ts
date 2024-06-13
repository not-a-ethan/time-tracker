import { sql } from "../utils/postgres"

export async function doesProjectExists(type: string, slug: string, id: Number, userID: Number) {
    let projectExists;

    if (type === "slug"){
        try {
            projectExists = await sql`SELECT * FROM projects WHERE slug = ${slug} AND user_id = ${userID}`
        } catch (e) {
            console.log(e)
            return {
                exists: true,
                status: 500,
                json: { error: "Internal server error. Can not get project" }
            }
        }
    
        if (projectExists.length > 0) {
            return {
                exists: true,
                status: 409,
                json: { error: "Project already exists" }
            }
        }
    
        return {
            exists: false,
            status: 200,
            json: { message: "project does not exist" }
        }
    } else if (type === "id") {
        try {
            projectExists = await sql`SELECT * FROM projects WHERE slug = ${slug} AND user_id = ${userID}`
        } catch (e) {
            console.log(e)
            return {
                exists: true,
                status: 500,
                json: { error: "Internal server error. Can not get project" }
            }
        }
    
        if (projectExists.length > 0) {
            return {
                exists: true,
                status: 409,
                json: { error: "Project already exists" }
            }
        }
    
        return {
            exists: false,
            status: 200,
            json: { message: "project does not exist" }
        }
    } else {
        return {
            exists: true,
            status: 400,
            json: { error: "No type or invaliad type provided"}
        }
    }
}