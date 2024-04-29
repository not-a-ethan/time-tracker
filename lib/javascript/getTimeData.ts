export async function getTimeData() {
    const baseURL = 'time-tracker.replit.app'; // replace with your server's base URL
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

    const date = new Date();
    date.setSeconds(totalTime)
    const formattedTime = date.toISOString().slice(11, 19);

    const element = document.getElementById("totalTime");

    if (element) {
        element.innerText = formattedTime.toString();
    }

    return totalTime;
}