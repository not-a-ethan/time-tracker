'use client'

import { useRouter } from 'next/navigation'

import { useSession, getSession } from "next-auth/react"

import styles from './styles.module.css'

import ProjectName from './projectName'
import TimeEntryName from './entryName'
import PastTime from "./pastTime"

function Page({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const { data: session, status } = useSession()
    const id = Number(params.slug);

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
                <h1 className={styles.text}>
                    <ProjectName id={id} />
                    <img 
                        src="/images/trash.svg" 
                        alt="Picture of trash can for delete symbol" 
                        className={styles.trash}
                    />
                </h1>

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

                    <div className={`${styles.column2} ${styles.timeStuff}`}>
                        <PastTime id={id} />
                    </div>
                    
                </div>
            </>
        )
    }

    return renderContent();
}

export default Page;