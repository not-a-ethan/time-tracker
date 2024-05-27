'use client'

import type { NextPage } from 'next'

import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/navigation'

import { useSession, getSession } from "next-auth/react"

import { useForm, Controller } from 'react-hook-form';

import styles from './styles.module.css'

import ProjectName from './projectName'
import TimeEntryName from './entryName'

import Button  from '../../button'
import ShortTextInput  from '../../input'
import { useEffect } from 'react'

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
                <p>The project name is <span className='projectName'><ProjectName id={id} /></span></p>

                <div className={styles.grid}>
                    <div className={`${styles.timeEntries} ${styles.column1}`}>
                        <div className={styles.column1}>
                            <TimeEntryName id={id} type="name" />
                        </div>

                        <div className={styles.column2}>
                            <TimeEntryName id={id} type="time" />
                        </div>

                        <div className={styles.column3}>
                            <TimeEntryName id={id} type="dateMade" />
                        </div>
                    </div>

                    <div className={`${styles.column2} ${styles.timeStuff}`}>
                        <p>Total Time</p>
                        <p>Past Year</p>
                        <p>Past Month</p>
                        <p>Past Week</p>
                        <p>Past 24 hours</p>
                    </div>
                </div>
            </>
        )
    }

    return renderContent();
}

export default Page;