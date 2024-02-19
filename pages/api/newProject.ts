import type { NextApiRequest, NextApiResponse } from 'next'

import postgres from "postgres";

import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

const sql: any = postgres({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
    const method = req.method;
    const query = req.query;
    const body = req.body;

    if (method !== "POST") {
        res.status(418).json({ error: "Wrong method. Remember I am a Tea Pot" });
        return;
    }

    const slug = body["newProject"].replace(/ /g, "-").toLowerCase();

    // checks if project exists

    const session: any = await getServerSession(req, res, authOptions)
    const externalID = session.token.sub
    
      if (session) {
          let response;

          let userID = -1 
          
          try {
              const result = await sql`SELECT id FROM users WHERE external_id = ${externalID}`
              userID = result[0].id
          } catch (error) {
              console.log(error)
              res.status(500).json({ error: "Internal server error" })
              return;
          }

          if (userID === -1) {
              res.status(404).json({ error: "User not found" })
              return;
          }
          
          try {
              response = await sql`
                  INSERT INTO projects (user_id, project_name, slug)
                  VALUES
                  (${userID},${body["newProject"]},${slug})
              `
          } catch (error) {
              console.log(error)
              res.status(500).json({ error: "Something went wrong" });
              return;
          }
          
          res.status(200).json({ response });
          return;
      } else {
        // Not Signed in
        res.status(401).json({ error: "You must be signed in to do that" });
        return;
      }
}