import { toast } from 'sonner'

const apiReqeusts = (endpoint: string, data: any, method: string = "POST") => {
    const promise = new Promise((resolve, reject) => {
        fetch(endpoint, {
            method: `${method}`,
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.status === 200) {
                resolve("")
            } else {
                reject(new Error('Request failed with status code ' + response.status))
            }
        })
        .catch((error) => {
            console.error('Error:', error)
            reject(error)
        });
    })

    toast.promise(promise, {
        loading: "Sending request...",
        error: "Something went wrong. Details in console",
        success: "Request sucessful!"
    })
}

export default apiReqeusts