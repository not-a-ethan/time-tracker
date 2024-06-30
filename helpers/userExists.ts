import { sql } from "../utils/postgres"

export async function userExists(externalID: Number) {
    let userID = -1

    try {
        const result = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
        userID = result[0].id
    } catch (error) {
        return false
    }

    if (userID === -1) {
        return false
    }

    return userID
}