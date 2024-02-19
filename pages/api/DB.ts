import type { NextApiRequest, NextApiResponse } from 'next'
import postgres from "postgres";

const sql = postgres({
   host: process.env.PGHOST,
   port: Number(process.env.PGPORT),
   database: process.env.PGDATABASE,
   user: process.env.PGUSER,
   password: process.env.PGPASSWORD
});

// sql.query('SELECT * FROM users')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
   const body = req.body;
   const query = req.query;
   const method = req.method;

   if (method === "GET") {
      if (query["type"] === "time") {
         // get total time stuff
      } else if (query["type"] === "project") {
         if (query["projectType"] === "list") {
            // get a list of all projects
         } else if (query["projectType"] === "single") {
            //get details of a single project
         } else {
            res.status(400).json({ error: "Invalid project type" });
         }
      } else {
         res.status(400).json({ error: "Invalid query type" });
      }

       
   } else if (method === "POST") {

       
      if (body["newProject"] && !body["addTime"]) {
         const userId = 1
         const newProject = sql`INSERT INTO projects (user_id, project_name, slug) VALUES (${userId}, ${body["newProject"]["project_name"]})`
      } else if (!body["addTime"] && body["newProject"]) {
         const time = body["time"];
         const project = body["project"];

         // Line below will check if the project exists
         if (project === true) {
            if (typeof time === "number") {
               // adds time to project
            } else {
               res.status(400).json({ error: "Invalid amount time. Should be a positive number. Unit is seconds." });
            }
         } else {
            res.status(400).json({ error: "Project does not exist" });
         }
      } else if (!body["addTime"] && !body["newProject"]) {
         res.status(418).json({ error: "Invalid request. Please provide either a new project or a new time entry." });
      } else if (body["addTime"] && body["newProject"]) {
         res.status(418).json({ error: "Invalid request. You cannot add a time entry and a new project at the same time." });
      } else {
         res.status(400).json({ error: "Invalid request. Please provide either a new project or a new time entry." });
      }
   } else if (method === "PUT") {
      if (body["action"] === "update") {
         if (body["updateItem"] === "project") {
            if (body["updateType"] === "delete") {
               // delete project
            } else if (body["updateType"] === "rename") {
               // renames the project
            } else {
               res.status(400).json({ error: "Invalid update type" });
            }
         } else if (body["updateItem"] === "time") {
            if (body["updateType"] === "delete") {
               if (typeof body["timeID"] === "number") {
                  // delete time entry
               } else {
                  res.status(400).json({ error: "Invalid time ID" });
               }
            } else if (body["updateType"] === "move") {
               if (typeof body["timeID"] === "number") {
                  // moves the project the time entry is for
               } else {
                  res.status(400).json({ error: "Invalid time ID" });
               }
            } else {
               res.status(400).json({ error: "Invalid update type" });
            }
         } else {
            res.status(400).json({ error: "Invalid update item" });
         }
      } else {
         res.status(400).json({ error: "Invalid action" });
      }
   } else {
      res.status(405).json({
         error: "Method not allowed"
      });
   }
}