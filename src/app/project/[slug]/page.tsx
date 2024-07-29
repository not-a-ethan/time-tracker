'use client'

import type { NextPage } from 'next'
import { Metadata } from 'next'
import { useRouter } from 'next/navigation'

import { useSession, getSession } from "next-auth/react"

import { toast } from 'sonner'

import styles from './styles.module.css'

import ProjectName from './Javascript/projectName'

import TimeEntryName from '../components/entryName'
import PastTime from "../components/pastTime"
import AddEntry from '../components/addEntry'

import { confirm } from '../../../../utils/confirm'

function Page({ params }: { params: { slug: string } }) {
    const router = useRouter();

    const { data: session, status } = useSession();

    const id = Number(params.slug);

    const deleteSubmitHandler = () => {
        confirm("Are you sure you want to delete the project").then(async (confirmed) => {
            if (confirmed) {
                const promise = new Promise((resolve, reject) => {
                    const response = fetch(`/api/project/get?type=id&id=${id}`, {
                        method: "GET",
                    })
                    .then(response => response.json())
                    .catch((error) => {
                        console.error(error)
                        reject()
                    })
                    .then(data => {
                        fetch("/api/project/remove", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ deleteSlug: data[0].project_name })
                        })
                       .then(response => {
                            if (response.status === 200) {
                                resolve("");
                            } else {
                                reject(new Error('Request failed with status code'+ response.status));
                            }
                        })
                       .catch((error) => {
                            console.error('Error:', error);
                            reject();
                        });
                    })
                });

                toast.promise(promise, {
                    loading: "Sending request...",
                    error: "Something went wrong. Details in console",
                    success: "Request successful!"
                });

                router.replace("/");
            }
        });
    };

    const apiReqeusts = (endpoint: string, data: any, method: string) => {
        const promise = new Promise((resolve, reject) => {
            fetch(endpoint, {
                method: `${method}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
           .then(response => {
                if (response.ok) {
                    resolve("");
                } else {
                    throw new Error('Request failed with status code'+ response.status);
                }
            })
           .catch((error) => {
                console.error('Error:', error);
                reject();
            });
        });

        toast.promise(promise, {
            loading: "Sending request...",
            error: "Something went wrong. Details in console",
            success: "Request successful!"
        });
    };

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

                    <form target="dummyframe2" className={styles.formDelete} id='deleteProject' onSubmit={deleteSubmitHandler}>
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

                        <AddEntry id={id} />
                    </div>
                </div>
            </div>
        )
    }

    return renderContent();
}

export default Page;