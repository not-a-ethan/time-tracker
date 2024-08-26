"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "./login.module.css";

export default function App() {
    const router = useRouter();

    const { data: session } = useSession();
    if (session) {
        router.push("/");
        return (
            <div className={styles.body}>
                <p>Signed in as {session.user?.name ?? "unknow user"}</p>
                <br />
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        );
    }
    return (
        <div className={styles.body}>
            <p>Not signed in</p>
            <br />
            <button onClick={() => signIn()}>Sign in</button>
        </div>
    );
}
