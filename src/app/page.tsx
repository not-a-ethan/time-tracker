'use client'

import type { NextPage } from 'next'
import { Metadata } from 'next'

import { useRouter } from 'next/navigation'

import { useSession, getSession } from "next-auth/react"

import { useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';

import { toast } from 'sonner'

import styles from './styles.module.css'

import { getProjects } from './Javascript/getProjects'
import { getTimeData } from './Javascript/getTimeData'

import Button  from './components/button'
import ShortTextInput  from './components/input'

/*
export const metadata: Metadata = {
    title: 'Homework time tracker'
}
*/

function Index() {
    const router = useRouter();
    const { handleSubmit, control } = useForm();

    const createOnSubmitHandler = (endpoint: string, event: any) => {
        const values: any = {};
        
        for (let i = 0; i < event.target.length; i++) {
            const element = event.target[i];
            if (element.name && element.value) {
            values[element.name] = element.value;
            }
        }
        
        if (endpoint === "/api/time/addEntry") {
            timeEntry(endpoint, values)
        } else {
            apiReqeusts(endpoint, values)
        }

        return (SubmitEvent: any) => SubmitEvent.preventDefault();
    }

    const timeEntry = (endpoint: string, data: any) => {
        const seconds = (Number(data["target"][2].value) * 60 * 60) + (Number(data["target"][3].value) * 60) + Number(data["target"][4].value)

        const newData = {
            entryName: data["target"][1].value,
            slug: data["target"][0].value,
            time_seconds: seconds
        }

        apiReqeusts(endpoint, newData)

        return (SubmitEvent: any) => SubmitEvent.preventDefault();
    }


    const apiReqeusts = (endpoint: string, data: any) => {
        const promise = new Promise((resolve, reject) => {
            fetch(endpoint, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (response.status === 200) {
                    resolve("")
                } else {
                    reject(new Error('Request failed with status code ' + response.status))
                }
            })
            .catch((error) => {
                console.error('Error:', error)
                reject(error)
            });
        })

        toast.promise(promise, {
            loading: "Sending request...",
            error: "Something went wrong. Details in console",
            success: "Request sucessful!"
        })
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

                    <form target="dummyframe" className={styles.form} onSubmit={(e) => handleSubmit(createOnSubmitHandler('/api/project/new', e))}>
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

                    <form target="dummyframe2" className={styles.form} onSubmit={(e) => handleSubmit(createOnSubmitHandler('/api/project/remove', e))}>
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

                    <form method="POST" target="dummyframe3" className={styles.form} onSubmit={(e) => handleSubmit(timeEntry('/api/time/addEntry', e))}>
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
        </div>
    )
}

export default Index;