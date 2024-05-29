import { useEffect, useState } from 'react';

import TimeEntries from '../[slug]/Javascript/getTimeEntries'

import styles from "./styles.module.css"

function convertSecondsToDDHHMMSS(seconds: number) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    let hours: any = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    let minutes: any = Math.floor((seconds % (60 * 60)) / 60);
    let secondsLeft: any = seconds % 60;

    if (hours < 10) {
        hours = `0${hours}`
    }
    
    if (minutes < 10) {
        minutes = `0${minutes}`
    }

    if (secondsLeft < 10) {
        secondsLeft = `0${secondsLeft}`
    }

    return `${days}:${hours}:${minutes}:${secondsLeft}`;
}

export default function PastTime(props: any) {
    const id = Number(props.id);

    const [jsxResult, setJsxResult] = useState(<div>Loading...</div>);

    TimeEntries(id).then(function(result) {
        if (result === null) {

        } else {
            if (result.length === 0) {
                setJsxResult(<span></span>)
            }

            const currentTime: Date = new Date();

            let day = 0;
            let week = 0;
            let month = 0;
            let year = 0;
            let total = 0;

            for (let i = 0; i < result.length; i++) {
                const current = result[i]
                const diffrence = new Date(currentTime).getTime() - new Date(current["time_added"]).getTime()

                total += current["time_seconds"]

                if (diffrence < new Date(86400000).getTime()) { // "86400000" is 24 hours
                    day += current["time_seconds"]
                    week += current["time_seconds"]
                    month += current["time_seconds"]
                    year += current["time_seconds"]
                } else if (diffrence < new Date(604800000).getTime()) { // "604800000" is 7 days
                    week += current["time_seconds"]
                    month += current["time_seconds"]
                    year += current["time_seconds"]
                } else if (diffrence < new Date(2592000000).getTime()) { // "2592000000" is one month
                    month += current["time_seconds"]
                    year += current["time_seconds"] 
                } else if (diffrence < new Date(31536000000).getTime()) { // "31536000000" is one year
                    year += current["time_seconds"] 
                }
            }

            setJsxResult(
                <>
                    <p className={styles.text}>Total Time: {convertSecondsToDDHHMMSS(total)}</p>
                    <p className={styles.text}>Past Year: {convertSecondsToDDHHMMSS(year)}</p>
                    <p className={styles.text}>Past Month: {convertSecondsToDDHHMMSS(month)}</p>
                    <p className={styles.text}>Past Week: {convertSecondsToDDHHMMSS(week)}</p>
                    <p className={styles.text}>Past 24 Hours: {convertSecondsToDDHHMMSS(day)}</p>
                </>
            )
        }
    })

    return jsxResult
}