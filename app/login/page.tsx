'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'

export default function App() {
  const router = useRouter();
  
   const { data: session } = useSession()
     if (session) {
      router.push("/")
       return (
         <>
           Signed in as {session.user?.name ?? 'unknow user'} <br />
           <button onClick={() => signOut()}>Sign out</button>
         </>
       )
     }
     return (
       <>
         Not signed in <br />
         <button onClick={() => signIn()}>Sign in</button>
       </>
     )
}