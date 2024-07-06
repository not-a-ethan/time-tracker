'use client'

import type { NextPage } from 'next'
import { Metadata } from 'next'
import { useRouter } from 'next/navigation'

import { useSession, getSession } from "next-auth/react"

import { useForm, Controller } from 'react-hook-form';

import toast, { Toaster } from 'react-hot-toast'

import styles from './styles.module.css'

import Button  from '../../components/button'
import ShortTextInput  from '../../components/input'

import ProjectName from './Javascript/projectName'
import TimeEntryName from '../components/entryName'
import PastTime from "../components/pastTime"
import { confirm } from '../../../../utils/confirm'

function Page({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const { handleSubmit, control } = useForm();

    const { data: session, status } = useSession();

    const id = Number(params.slug);

    const createOnSubmitHandler = (endpoint: string, event: any) => {
        const values: any = {};

        try {
            for (let i = 0; i < event.target.length; i++) {
                const element = event.target[i];
                if (element.name && element.value) {
                    values[element.name] = element.value;
                }
            }
        } catch (error) {
            console.error(error)
            if (endpoint === "/api/project/remove") {
                deleteSubmitHandler(endpoint, values)
            }
            return;
        }
        
        if (endpoint === "/api/time/addEntry") {
            timeEntry(endpoint, values)
        }

        return (SubmitEvent: any) => SubmitEvent.preventDefault();
    }

    async function deleteSubmitHandler(endpoint: string, data: any) {
        if (!await confirm("Are you sure you want to delete the project")) {
            //toast.error("Deletion canceled.")
            return;
        }

        fetch(`/api/project/get?type=id&id=${id}`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 200) {
                toast.error(data.error)
            }
            
            return data
        })
        .catch((error) => console.error(error))
        .then(data => 
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deleteSlug: data[0].project_name })
            })
            .then(response => {
                if (response.status === 200) {
                    toast.success("API request successful!")
                } else {
                    toast.error("Something went wrong")
                }
                
                return response
            })
            .catch((error) => console.error('Error:', error))
        )
 
        router.push("/")
        return;
    }

const apiReqeusts = (endpoint: string, data: any) => {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.status === 200) {
                toast.success("API request successful!")
            } else {
                toast.error("Something went wrong")
            }
            
            return response
        })
        .catch((error) => {
            console.error('Error:', error)
        });
    }
    const timeEntry = (endpoint: string, data: any) => {
        fetch(`/api/project/get?type=id&id=${id}`)
        .then(response => response.json())
        .then(projectData => {
            const seconds = (Number(data["time_hours"]) * 60 * 60) + (Number(data["time_minutes"]) * 60) + Number(data["time_seconds"])

            const newData = {
                entryName: data["entryName"],
                slug: projectData[0]["slug"],
                time_seconds: seconds
            }
    
            apiReqeusts(endpoint, newData)
        })
    }

    const renderContent = () => {
        if (status === "loading") {
            return (<p>Loading...</p>)
        }
    
        if (status === "unauthenticated") {
            router.push("/login")
            return (<p>Access Denied</p>)
        }

        if (isNaN(id)) {
            return (
                <p>The slug is not a number</p>
            )
        }

        return (
            <div className={styles.all}>
                <div className={styles.header}>
                    <h1 className={styles.text}>
                        <a href='/'>
                            <img
                                src='/images/home.svg'
                                alt='home'
                            />
                        </a>
                        <ProjectName id={id} />
                    </h1>

                    <iframe name="dummyframe2" id="dummyframe" className={styles.iframe}></iframe>

                    <form target="dummyframe2" className={styles.formDelete} id='deleteProject' onSubmit={handleSubmit((e) => createOnSubmitHandler('/api/project/remove', e))}>
                        <button className={styles.button} id="trueSubmit" type='submit' >
                            <img 
                                src="/images/trash.svg" 
                                alt="Picture of trash can for delete symbol" 
                                className={styles.trash}
                            />
                        </button>
                    </form>
                </div>

                <div className={styles.grid}>
                    <div className={`${styles.timeEntries} ${styles.column1}`}>
                        <div className={`${styles.column1} ${styles.entries}`}>
                            <TimeEntryName id={id} type="name" />
                        </div>

                        <div className={`${styles.column2} ${styles.dividers}`}></div>

                        <div className={styles.column3}>
                            <TimeEntryName id={id} type="time" />
                        </div>

                        <div className={`${styles.column4} ${styles.dividers}`}></div>

                        <div className={styles.column5}>
                            <TimeEntryName id={id} type="dateMade" />
                        </div>

                        <div className={`${styles.column6} ${styles.dividers}`}></div>

                        <div className={styles.column7}>
                            <TimeEntryName id={id} type="delete-button" />
                        </div>
                    </div>

                    <div className={`${styles.column2} ${styles.timeStuff} ${styles.text}`}>
                        <PastTime id={id} />

                        <br /><br />

                        <iframe name="dummyframe3" id="dummyframe" className={styles.iframe}></iframe>

                        <form method="POST" target="dummyframe3" className={styles.form} onSubmit={(e) => handleSubmit(createOnSubmitHandler('/api/time/addEntry', e))}>
                            <div className={`${styles["form-input"]}`}>
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
                </div>
                <Toaster />
            </div>
        )
    }

    return renderContent();
}

export default Page;