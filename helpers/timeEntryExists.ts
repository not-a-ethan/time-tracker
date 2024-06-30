import { sql } from "../utils/postgres"

export async function doesTimeEntryExist(id: Number, userId: Number) {
    let entryExists;

    try {
        entryExists = await sql`SELECT * FROM timeentries WHERE id = ${id} AND user_id = ${userId}`
    } catch (error) {
        return {
            exists: true,
            status: 500,
            json: { 
                error: "Internal server error | Could not get time entry" 
            }
        }
    }

    if (entryExists.length === 0) {
        return {
            exists: true,
            status: 404,
            json: { 
                error: "Entry not found"
            }
        }
    }

    return {
        exists: false,
        status: 200,
        json: { 
            message: "Time Entry does not exist" 
        }
    }
}