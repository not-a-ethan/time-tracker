export function convertSecondsToDDHHMMSS(seconds: number) {
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