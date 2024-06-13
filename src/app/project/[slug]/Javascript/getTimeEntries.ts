import React, { useState, useEffect } from 'react';

import styles from "./styles.module.css"

export default async function TimeEntries(id: number) {
    let timeEntries;

    let currentData = sessionStorage.getItem(`${id}-timeEntries`);
    if (!currentData || currentData === 'undefined' || currentData === 'null') {
        const url = `/api/time/get?type=project&project_id=${id}`;

        const response = await fetch(url, {
            method: 'GET'
        });

        let json = await response.json();

        if (response.status === 500) {
            return null;
        }

        console.log(json)

        json = json.reverse();
        timeEntries = json;

        sessionStorage.setItem(`${id}-timeEntries`, JSON.stringify(timeEntries));
    } else {
        currentData = JSON.parse(currentData);
        timeEntries = currentData
    }
    
    return timeEntries;
}