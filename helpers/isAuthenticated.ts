export function isAuthenticated(session: any) {
    if (!session) {
        // Not Signed in
        return false
    }

    return true
}