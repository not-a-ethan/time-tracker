import { useEffect, useState } from 'react';

import TimeEntries from './getTimeEntries'

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
            if (result.length === 0) {
                setJsxResult(<div>No entries</div>);
            } else {
                if (type === "name") {
                    setJsxResult(
                        <ul>
                            {result.map((entry: TimeEntry) => (
                                <li key={entry.id}>
                                    {entry.entry_name}
                                </li>
                            ))}
                        </ul>
                    );
                } else if (type === "time") {
                    setJsxResult(
                        <ul>
                            {result.map((entry: TimeEntry) => (
                                <li key={entry.id}>
                                    {new Date(entry.time_seconds * 1000).toISOString().slice(11, 19)}
                                </li>
                            ))}
                        </ul>
                    );
                } else if (type === "dateMade") {
                    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                    const howToFormat = Intl.DateTimeFormat(undefined, options);
                    setJsxResult(
                        <ul>
                            {result.map((entry: TimeEntry) => (
                                <li key={entry.id}>
                                    {howToFormat.format(new Date(entry.time_added))}
                                </li>
                            ))}
                        </ul>
                    );
                } else {
                    setJsxResult(<div>Invalid type</div>);
                }
            }
        });
    }, [id]); // re-run the effect when `id` changes

    return jsxResult;
}