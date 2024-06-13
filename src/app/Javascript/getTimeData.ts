import { convertSecondsToDDHHMMSS } from "../../../utils/timeConvert"

export async function getTimeData() {
    const baseURL = window.location.origin;
    const url = new URL('/api/time/get', baseURL);

    const response = await fetch(`${url}?type=total`, {
        method: 'GET',
    })

    let totalTime = 0;

    const responseJSON = await response.json();
    
    for (let i = 0; i < responseJSON.length; i++) {
        const timeEntry = responseJSON[i];
        
        totalTime += timeEntry.time_seconds;
    }

    const element = document.getElementById("totalTime");

    if (element) {
        element.innerText = `${convertSecondsToDDHHMMSS(totalTime)}`
    }

    return totalTime;
}