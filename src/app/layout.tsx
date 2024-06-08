import { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Head from 'next/head'

import { Providers } from './providers'

import '../styles/globals.css'

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode,
  }) {

    return (
      <html>
        <Head>
          <title>Home</title>
          <meta name="description" content="Welcome to Next.js" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    )
  }