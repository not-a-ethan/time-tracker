import { useEffect, useState } from 'react';

import TimeEntries from '../[slug]/Javascript/getTimeEntries'

import styles from "./css/entries.module.css"

export default function TimeEntryName(props: any) {
    const id = Number(props.id);
    const type = props.type;

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
                                    <li key={entry.id} className={`${styles.text} ${styles.listItem}`}>
                                        {entry.entry_name}
                                    </li>
                                ))}
                            </ul>
                        );
                    } else if (type === "time") {
                        setJsxResult(
                            <ul className={styles.list}>
                                {result.map((entry: TimeEntry) => (
                                    <li key={entry.id} className={`${styles.text} ${styles.listItem}`}>
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
                                    <li key={entry.id} className={`${styles.text} ${styles.listItem}`}>
                                        {howToFormat.format(new Date(entry.time_added))}
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