import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { useEffect } from 'react';

import { useSession, getSession } from "next-auth/react"

import styles from '../styles/Home.module.css'

function Index() {
    const router = useRouter();

    const { data: session, status } = useSession()

    
    useEffect(() => {
        fetch('/api/project/new', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            // Handle the data from the response here
        })
        .catch(error => {
            // Handle any errors here
        });
    }, []);
    if (status === "loading") {
        return <p>Loading...</p>
    }

    if (status === "unauthenticated") {
        router.push("/login")
        return <p>Access Denied</p>
    }

    return (
        <div className={styles.container}>
            <Head>
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Homework time tracker</title>
            </Head>

            <main className={styles.main}>
                <h1>Time Tracker</h1>
                

                <div>
                    {/*A form to make a new project*/}

                    <iframe name="dummyframe" id="dummyframe" className={styles.iframe}></iframe>

                    <form method="POST" action="/api/project/new" target="dummyframe">
                        <input type="text" name="newProject" placeholder="New Project" />
                        <input type="submit" value="Create Project" />
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Index;