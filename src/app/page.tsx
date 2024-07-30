'use client'

import type { NextPage } from 'next'
import { Metadata } from 'next'

import { useRouter } from 'next/navigation'

import { useSession, getSession } from "next-auth/react"

import React, { useEffect } from 'react';

import styles from './styles.module.css'

import { getProjects } from './Javascript/getProjects'
import { getTimeData } from './Javascript/getTimeData'

import NewProject from './components/newProject'
import DeleteProject from './components/deleteProject'
import NewTimeEntry from './components/newTimeEntry'

/*
export const metadata: Metadata = {
    title: 'Homework time tracker'
}
*/

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

    return (
        <div className={styles.all}>
            <h1 className={`${styles.header}`}>Time Tracker</h1>

            <main className={styles.main}>

                <div className={`${styles.rowOne} ${styles.columnOne}`}>
                    <NewProject />
                </div>

                <div className={`${styles.columnThree}`}>
                    {/*A list of projects*/}
                    <ul id="projectList" className={styles.projectList}>
                    
                    </ul>
                </div>

                <div className={`${styles.rowOne} ${styles.columnTwo}`}>
                    <DeleteProject />
                </div>

                <div className={`${styles.rowTwo} ${styles.columnOne}`}>
                    <NewTimeEntry />
                </div>

                <div className={`${styles.rowTwo} ${styles.columnTwo}`}>
                    <p className={styles.timeTracked}>Total time tracked: <span id="totalTime"></span></p>
                </div>
            </main>
        </div>
    )
}

export default Index;