import { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"

import { Toaster } from "sonner"

import { Providers } from './providers'

import '../styles/globals.css'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: "Welcome to Next.js"
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode,
  }) {

    return (
      <html>
        <body>
          <Providers>{children}</Providers>
          <Toaster />
        </body>
      </html>
    )
  }