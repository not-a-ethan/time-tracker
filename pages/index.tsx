import type { NextPage } from 'next'
import Head from 'next/head'
import Script from 'next/script'

import { useEffect, useState } from 'react';

import { useRouter } from 'next/router'

import { useSession, getSession } from "next-auth/react"

import styles from '../styles/Home.module.css'

import { getProjects } from '../lib/javascript/getProjects'
import { getTimeData } from '../lib/javascript/getTimeData'

import  Button  from '../lib/components/button'
import  ShortTextInput  from '../lib/components/input'

function Index() {
    const router = useRouter();

    const { data: session, status } = useSession()

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const projectList = document.getElementById("projectList");
            if (projectList) {
                getProjects();
                observer.disconnect();
            }
        });
    
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const timeElement = document.getElementById("totalTime");
            if (timeElement) {
                getTimeData();
                observer.disconnect();
            }
        });
    
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    if (status === "loading") {
        return (<p>Loading...</p>)
    }

    if (status === "unauthenticated") {
        router.push("/login")
        return (<p>Access Denied</p>)
    }

    return (
        <div>
            <Head>
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Homework time tracker</title>
            </Head>

            <main>
                <h1 className={styles.header}>Time Tracker</h1>
                

                <div>
                    {/*A form to make a new project*/}

                    <iframe name="dummyframe" id="dummyframe" className={styles.iframe}></iframe>

                    <form method="POST" action="/api/project/new" target="dummyframe" className={styles.form}>
                        <ShortTextInput text="Project name" height="2.5vh" className={styles["form-input"]} />

                        <Button text="Create Project" type="submit" name="newProject" className={styles["form-submit"]} height="2.5vh" />
                    </form>
                </div>

                <div>
                    {/*A list of projects*/}
                    <ul id="projectList">
                    
                    </ul>
                </div>

                <div>
                    {/*A form to delete a project*/}

                    <iframe name="dummyframe2" id="dummyframe" className={styles.iframe}></iframe>

                    <form method="POST" action="/api/project/remove" target="dummyframe2" className={styles.form}>
                        <ShortTextInput text="Project name" name="slug" height="2.5vh" className={styles["form-input"]} />

                        <Button text="Delete Project" type="submit" className={styles["form-submit"]} height="2.5vh" />
                    </form>
                </div>

                <br />

                <div>
                    {/*A form to make a new time entry*/}

                    <iframe name="dummyframe3" id="dummyframe" className={styles.iframe}></iframe>

                    <form method="POST" action="/api/time/addEntry" target="dummyframe3" className={styles.form}>
                        <div className={`${styles["form-input"]}`}>
                            <ShortTextInput text="Project name" name="slug" height="2.5vh" style={{width: "5vw"}} />

                            <br />

                            <ShortTextInput text="Description" name="description" height="2.5vh" style={{width: "5vw"}} />
                        </div>
                        <Button text="Add Time" type="submit" className={styles["form-submit"]} height="2.5vh" style={{display: 'block', margin: 'auto 0'}} />
                    </form>
                </div>

                <div>
                    <p>Total time tracked: <span id="totalTime"></span></p>
                </div>

                <ShortTextInput text="Project name" height="2.5vh" />
            </main>
        </div>
    )
}

export default Index;