import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import createNewUser from "../../../lib/javascript/createUser"

interface Profile extends Record<string, unknown> {
    id: string;
}

interface Account extends Record<string, unknown> {
    provider: string;
}

export const authOptions: any = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        signIn: async (user: any, account: Account, profile: Profile) => {
            // // Read EXTERNAL ID with `user.account.providerAccountId`
            return true;
        },
        session: async (session: any, user: any) => {
            // Read EXTERNAL ID with `user.token.sub` or `user.token.sub`
            return session;
        },
    },
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);