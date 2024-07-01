'use client'

import { useEffect, useState } from 'react';

import toast from 'react-hot-toast'

import { confirm } from "../../../../utils/confirm"

import TimeEntries from '../[slug]/Javascript/getTimeEntries'

import styles from "./css/entries.module.css"

export default function TimeEntryName(props: any) {
    const id = Number(props.id);
    const type = props.type;

    const deleteTimeEntry = async (e: any) => {
        if (await confirm("Are you sure you want to delete the time entry?")){
            try {
                const id = e.target.id;
                apiReqeusts("/api/time/removeEntry", {id: `${id}`}, "DELETE")
            } catch (error) {
                console.log(error)
            }
        } else {
            toast.error("Deletion canceled")
        }
    }

    const apiReqeusts = (endpoint: string, data: any, method: string) => {
        fetch(endpoint, {
            method: `${method}`,
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
            console.error(error)
        });
    }

    const [jsxResult, setJsxResult] = useState(<div>Loading...</div>);

    interface TimeEntry {
        entry_name: string;
        id: number;
        project_id: number;
        slug: string;
        time_added: string;
        time_seconds: number;
        user_id: number;
    }

    useEffect(() => {
        TimeEntries(id).then(function(result) {
            if (result === null) {
                return;
            } else {
                if (result.length === 0) {
                    setJsxResult(<div>No entries</div>);
                } else {
                    if (type === "name") {
                        setJsxResult(
                            <ul className={styles.list}>
                                {result.map((entry: TimeEntry) => (
                                    <li key={entry.id} id={String(entry.id)} className={`${styles.text} ${styles.listItem}`}>
                                        {entry.entry_name}
                                    </li>
                                ))}
                            </ul>
                        );
                    } else if (type === "time") {
                        setJsxResult(
                            <ul className={styles.list}>
                                {result.map((entry: TimeEntry) => (
                                    <li key={entry.id} id={String(entry.id)} className={`${styles.text} ${styles.listItem}`}>
                                        {new Date(entry.time_seconds * 1000).toISOString().slice(11, 19)}
                                    </li>
                                ))}
                            </ul>
                        );
                    } else if (type === "dateMade") {
                        const options: Intl.DateTimeFormatOptions = { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: 'numeric' 
                        };
                        const howToFormat = Intl.DateTimeFormat(undefined, options);
                        setJsxResult(
                            <ul className={styles.list}>
                                {result.map((entry: TimeEntry) => (
                                    <li key={entry.id} id={String(entry.id)} className={`${styles.text} ${styles.listItem}`}>
                                        {howToFormat.format(new Date(entry.time_added))}
                                    </li>
                                ))}
                            </ul>
                        );
                    } else if (type === "delete-button") {
                        setJsxResult(
                            <ul className={styles.list}>
                                {result.map((entry: TimeEntry) => (
                                    <li key={entry.id} className={`${styles.text} ${styles.listItem}`} onClick={deleteTimeEntry}>
                                        <button className={styles.button} id={String(entry.id)} type='button'>
                                            <img 
                                                src="/images/trash.svg" 
                                                alt="Picture of trash can for delete symbol" 
                                                className={styles.trash}
                                                id={String(entry.id)}
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        );
                    } else {
                        setJsxResult(<div>Invalid type</div>);
                    }
                }
            }
        });
    }, [id]); // re-run the effect when `id` changes

    return jsxResult;
}