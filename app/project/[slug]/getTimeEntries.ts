import React, { useState, useEffect } from 'react';

import styles from "./styles.module.css"
import { time } from 'console';

export default async function TimeEntries(id: number) {
    let timeEntries;

    let currentData = sessionStorage.getItem('timeEntries');
    if (!currentData || currentData === 'undefined' || currentData === 'null') {
        const url = `/api/time/get?type=project&project_id=${id}`;

        const response = await fetch(url, {
            method: 'GET'
        });

        let json = await response.json();
        json = json.response.reverse();
        timeEntries = json;

        sessionStorage.setItem('timeEntries', JSON.stringify(timeEntries));
    } else {
        currentData = JSON.parse(currentData);
        timeEntries = currentData
    }
    
    return timeEntries;
}