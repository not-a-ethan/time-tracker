'use client'

import type { NextPage } from 'next'
import { Metadata } from 'next'
import { useRouter } from 'next/navigation'

import { useSession, getSession } from "next-auth/react"

import { useEffect, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';

import toast, { Toaster } from 'react-hot-toast'

import styles from './styles.module.css'

import { getProjects } from './Javascript/getProjects'
import { getTimeData } from './Javascript/getTimeData'

import  Button  from './components/button'
import  ShortTextInput  from './components/input'

/*
export const metadata: Metadata = {
    title: 'Homework time tracker'
}
*/

function Index() {
    const router = useRouter();
    const { handleSubmit, control } = useForm();

    const timeEntry = (endpoint: string) => (data: any) => {
        console.log("Thing was called")
        const seconds = (data["time_hours"] * 60 * 60) + (data["time_minutes"] * 60) + data["time_seconds"]

        const newData = {
            entryName: data["entryName"],
            slug: data["slug"],
            time_seconds: seconds
        }

        apiReqeusts(endpoint, newData)
    }

    const createOnSubmitHandler = (endpoint: string) => (data: any) => {
        apiReqeusts(endpoint, data)
    }

    const apiReqeusts = (endpoint: string, data: any) => {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                toast.success("API request successful!")
            } else {
                console.log(data)
                toast.error(data.error)
            }
            
            return data
        })
        .catch((error) => {
            console.error('Error:', error)
        });
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
                            name="deleteSlug"
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

                <div className={`${styles.rowTwo} ${styles.columnOne}`}>
                    {/*A form to make a new time entry*/}

                    <iframe name="dummyframe3" id="dummyframe" className={styles.iframe}></iframe>

                    <form method="POST" target="dummyframe3" className={styles.form} onSubmit={handleSubmit(timeEntry('/api/time/addEntry'))}>
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
                                name="entryName"
                                control={control}
                                render={({ field }) => (
                                    <ShortTextInput 
                                        text="Entry name" 
                                        height="2.5vh"
                                        width="5vw"
                                        {...field} 
                                    />
                                )}
                            />

                            <br />

                            <Controller
                            name="time_hours"
                            control={control}
                            render={({ field }) => (
                                <ShortTextInput 
                                    text="Hours" 
                                    height="2.5vh"
                                    width="5vw"
                                    {...field} 
                                />
                            )}
                            />

                        <Controller
                            name="time_minutes"
                            control={control}
                            render={({ field }) => (
                                <ShortTextInput 
                                    text="Minutes" 
                                    height="2.5vh"
                                    width="5vw"
                                    {...field} 
                                />
                            )}
                            />

                        <Controller
                            name="time_seconds"
                            control={control}
                            render={({ field }) => (
                                <ShortTextInput 
                                    text="seconds" 
                                    height="2.5vh"
                                    width="5vw"
                                    {...field} 
                                />
                            )}
                            />
                        </div>

                        <div className={styles["form-submit"]} style={{display: 'block', margin: 'auto 0', marginLeft: "7.5%"}}>
                            <Button text="Add Time" type="submit"  height="2.5vh" />
                        </div>
                    </form>
                </div>

                <div className={`${styles.rowTwo} ${styles.columnTwo}`}>
                    <p className={styles.timeTracked}>Total time tracked: <span id="totalTime"></span></p>
                </div>
            </main>

            <Toaster />
        </div>
    )
}

export default Index;