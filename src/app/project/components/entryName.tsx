'use client'

import { useEffect, useState } from 'react';

import { toast } from 'sonner'

import { confirm } from "../../../../utils/confirm"

import TimeEntries from '../[slug]/Javascript/getTimeEntries'

import styles from "./css/entries.module.css"

export default function TimeEntryName(props: any) {
    const id = Number(props.id);
    const type = props.type;

    function deleteTimeEntry(e: any): boolean | void {
        confirm("Are you sure you want to delete the time entry?").then((result) => {
            if (!result) {
                return false;
            }

            let id;

            try {
                id = e.target.id;
                
            } catch (error) {
                console.log(error)
                return;
            }

            apiReqeusts("/api/time/removeEntry", {id: `${id}`}, "DELETE")
        })
    }

    const apiReqeusts = async (endpoint: string, data: any, method: string) => {
        const promise = new Promise((resolve, reject) => {
            fetch(endpoint, {
                method: `${method}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (response.status === 200) {
                    resolve("")
                } else {
                    throw new Error('Request failed with status code'+ response.status);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                reject("")
            });
        })
        
        toast.promise(promise, {
            loading: "Sending request...",
            success: "Request sucessful!",
            error: "Something went wrong. Details in console"
        })
    };

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
                                                id={String(entry.id)}
                                                className={styles.trash}
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