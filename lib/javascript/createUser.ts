import postgres from 'postgres';

const sql: any = postgres({
   host: process.env.PGHOST,
   port: process.env.PGPORT ? parseInt(process.env.PGPORT) : undefined,
   database: process.env.PGDATABASE,
   user: process.env.PGUSER,
   password: process.env.PGPASSWORD,
   ssl: {
      rejectUnauthorized: false,
   },
});

async function createNewUser(externalId: number, oAuthProvider: string, externalUsername: string) {   

   const users = await sql`SELECT * FROM users WHERE external_id = ${externalId} AND external_provider = ${oAuthProvider};`
   
   if (users.length === 0) {
       return;
       // not accepting new users to prevent an unexpected charge
      const res = await sql`INSERT INTO users (external_username, external_id, external_provider) VALUES (${externalUsername}, ${externalId}, ${oAuthProvider})`
   }
    return;
}

export default createNewUser;