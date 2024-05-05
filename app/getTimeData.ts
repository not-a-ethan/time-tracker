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

    const seconds = totalTime % 60;
    const minutes = Math.floor(totalTime / 60) % 60;
    const hours = Math.floor(totalTime / 60 / 60) % 24;
    const days = Math.floor(totalTime / 60 / 60 / 24);

    const element = document.getElementById("totalTime");

    if (element) {
        element.innerText = `${days}:${hours}:${minutes}:${seconds}`
    }

    return totalTime;
}