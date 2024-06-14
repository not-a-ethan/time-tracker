'use client'

import { useRouter } from 'next/navigation'

import { useSession, getSession } from "next-auth/react"

import { useForm } from 'react-hook-form';

import toast, { Toaster } from 'react-hot-toast'

import ProjectName from './Javascript/projectName'
import TimeEntryName from '../components/entryName'
import PastTime from "../components/pastTime"

import styles from './styles.module.css'

function Page({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const { handleSubmit } = useForm();
    const { data: session, status } = useSession();

    const id = Number(params.slug);

    const createOnSubmitHandler = (endpoint: string) => (data: any) => {
        fetch(`/api/project/get?type=id&id=${id}`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 200) {
                console.log(data)
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
            .catch((error) => console.error('Error:', error))
        )
 
        router.push("/")
        return;
    }
    
    function confirmation() {        
        const element = document.getElementsByClassName("trueSubmit")[0]

        if (element !== null) {
            const button = element as HTMLElement
            button.style.display = "block";
        }
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
            <>
                <div className={styles.header}>
                    <h1 className={styles.text}>
                        <ProjectName id={id} />
                    </h1>

                    <iframe name="dummyframe2" id="dummyframe" className={styles.iframe}></iframe>

                    <form target="dummyframe2" className={styles.form} onSubmit={handleSubmit(createOnSubmitHandler('/api/project/remove'))} >
                        <button className={styles.button} id="trueSubmit" onClick={confirmation} type='button' >
                            <img 
                                src="/images/trash.svg" 
                                alt="Picture of trash can for delete symbol" 
                                className={styles.trash}
                            />
                        </button>

                        <div className={`trueSubmit ${styles.trueSubmit}`} >
                            <button type='submit'>Are you sure you want to do this?</button>
                        </div>
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
                    </div>

                    <div className={`${styles.column2} ${styles.timeStuff} ${styles.text}`}>
                        <PastTime id={id} />
                    </div>
                    
                </div>

                <Toaster />
            </>
        )
    }

    return renderContent();
}

export default Page;