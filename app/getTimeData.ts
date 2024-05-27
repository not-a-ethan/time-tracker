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

export async function getTimeData() {
    const baseURL = window.location.origin;
    const url = new URL('/api/time/get', baseURL);

    const response = await fetch(`${url}?type=total`, {
        method: 'GET',
    })

    let totalTime = 0;

    const responseJSON = await response.json();
    
    for (let i = 0; i < responseJSON["response"].length; i++) {
        const timeEntry = responseJSON["response"][i];
        
        totalTime += timeEntry.time_seconds;
    }

    const element = document.getElementById("totalTime");

    if (element) {
        element.innerText = `${convertSecondsToDDHHMMSS(totalTime)}`
    }

    return totalTime;
}