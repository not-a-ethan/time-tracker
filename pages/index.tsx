import type { NextPage } from 'next'
import Head from 'next/head'
import Script from 'next/script'
import { useSession, getSession } from "next-auth/react"


import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form';

import styles from '../styles/Home.module.css'

import { getProjects } from '../lib/javascript/getProjects'
import { getTimeData } from '../lib/javascript/getTimeData'

import  Button  from '../lib/components/button'
import  ShortTextInput  from '../lib/components/input'

function Index() {
    const router = useRouter();
    const { handleSubmit, control } = useForm();

    const createOnSubmitHandler = (endpoint: string) => (data: any) => {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => data)
        .catch((error) => console.error('Error:', error));
    }

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

            <h1 className={styles.header}>Time Tracker</h1>

            <main className={styles.main}>

                <div className={`${styles.rowOne} ${styles.columnOne}`}>
                    {/*A form to make a new project*/}

                    <iframe name="dummyframe" id="dummyframe" className={styles.iframe}></iframe>

                    <form target="dummyframe" className={styles.form} onSubmit={handleSubmit(createOnSubmitHandler('/api/project/new'))}>
                        <Controller
                            name="newProject"
                            control={control}
                            render={({ field }) => (
                                <ShortTextInput 
                                    text="Project name" 
                                    height="2.5vh"
                                    width="5vw"
                                    {...field} 
                                />
                            )}
                        />

                        <Button text="Create Project" type="submit" name="newProject" className={styles["form-submit"]} height="2.5vh" />
                    </form>
                </div>

                <div className={`${styles.columnThree}`}>
                    {/*A list of projects*/}
                    <ul id="projectList" className={styles.projectList}>
                    
                    </ul>
                </div>

                <div className={`${styles.rowOne} ${styles.columnTwo}`}>
                    {/*A form to delete a project*/}

                    <iframe name="dummyframe2" id="dummyframe" className={styles.iframe}></iframe>

                    <form target="dummyframe2" className={styles.form} onSubmit={handleSubmit(createOnSubmitHandler('/api/project/remove'))}>
                        <Controller
                            name="slug"
                            control={control}
                            render={({ field }) => (
                                <ShortTextInput 
                                    text="Project name" 
                                    height="2.5vh"
                                    width="5vw"
                                    {...field} 
                                />
                            )}
                        />

                        <Button text="Delete Project" type="submit" className={styles["form-submit"]} height="2.5vh" />
                    </form>
                </div>

                <br />

                <div className={`${styles.rowTwo} ${styles.columnOne}`}>
                    {/*A form to make a new time entry*/}

                    <iframe name="dummyframe3" id="dummyframe" className={styles.iframe}></iframe>

                    <form method="POST" target="dummyframe3" className={styles.form} onSubmit={handleSubmit(createOnSubmitHandler('/api/time/addEntry'))}>
                        <div className={`${styles["form-input"]}`}>
                            <Controller
                                name="slug"
                                control={control}
                                render={({ field }) => (
                                    <ShortTextInput 
                                        text="Project name" 
                                        height="2.5vh"
                                        width="5vw"
                                        {...field} 
                                    />
                                )}
                            />

                            <br />

                            <Controller
                            name="time_seconds"
                            control={control}
                            render={({ field }) => (
                                <ShortTextInput 
                                    text="Time (seconds)" 
                                    height="2.5vh"
                                    width="5vw"
                                    {...field} 
                                />
                            )}
                        />
                        </div>

                        <Button text="Add Time" type="submit" className={styles["form-submit"]} height="2.5vh" style={{display: 'block', margin: 'auto 0'}} />
                    </form>
                </div>

                <div className={`${styles.rowTwo} ${styles.columnTwo}`}>
                    <p className={styles.timeTracked}>Total time tracked: <span id="totalTime"></span></p>
                </div>
            </main>
        </div>
    )
}

export default Index;