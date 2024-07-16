import { useForm, Controller } from 'react-hook-form';

import { toast } from 'sonner'

import apiReqeusts from '../../../../utils/apiRequest'
import { isStringNum } from '../../../../utils/isStringNum';

import Button  from '../../../components/button'
import ShortTextInput  from '../../../components/input'

import styles from "./css/addEntry.module.css"

function AddEntry(props: any) {
    const { handleSubmit, control } = useForm();
    const id = props["id"]

    const createOnSubmitHandler = (endpoint: string, event: any) => {
        const values: any = {};

        try {
            for (let i = 0; i < event.target.length; i++) {
                const element = event.target[i];
                if (element.name && element.value) {
                    values[element.name] = element.value;
                }
            }
        } catch (error) {
            return;
        }
        
        timeEntry(endpoint, values)

        return (SubmitEvent: any) => SubmitEvent.preventDefault();
    }

    const timeEntry = (endpoint: string, data: any) => {
        const entryName: string = data["entryName"]
        const hours: string = data["time_hours"]
        const minutes: string = data["time_minutes"]
        const secondsAlone: string = data["time_seconds"]

        if (entryName === "" || entryName === undefined || entryName === null) {
            toast.error("Entry Name is invalid")
            return (SubmitEvent: any) => SubmitEvent.preventDefault();
        }

        if (!(isStringNum(hours) || hours === "")) {
            toast.error("The value for hours is not a number")
            return (SubmitEvent: any) => SubmitEvent.preventDefault();
        }

        if (!(isStringNum(minutes) || minutes === "")) {
            toast.error("The value for minutes is not a number")
            return (SubmitEvent: any) => SubmitEvent.preventDefault();
        }

        if (!(isStringNum(secondsAlone) || secondsAlone === "")) {
            toast.error("The value for seconds is not a number")
            return (SubmitEvent: any) => SubmitEvent.preventDefault();
        }

        const seconds = (Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(secondsAlone)

        fetch(`/api/project/get?type=id&id=${id}`, {
            method: "GET",
        })
        .then(response => response.json())
        .catch((error) => console.error(error))
        .then(requestData => {
            const projectSlug = requestData[0].slug
            const newData = {
                entryName: data["entryName"],
                slug: projectSlug,
                time_seconds: seconds
            }

            apiReqeusts(endpoint, newData, "POST")
        })
    }
    
    return (
        <>
            <iframe name="dummyframe3" id="dummyframe" className={styles.iframe}></iframe>

            <form method="POST" target="dummyframe3" className={styles.form} onSubmit={(e) => createOnSubmitHandler('/api/time/addEntry', e)}>
                <div className={`${styles["form-input"]}`}>
                    <Controller
                        name="entryName"
                        control={control}
                        render={({ field }) => (
                            <ShortTextInput
                                text="Entry name" 
                                height="2.5vh"
                                width="5vw"
                                {...field}
                            />
                        )}
                    />

                    <br />

                    <Controller
                        name="time_hours"
                        control={control}
                        render={({ field }) => (
                            <ShortTextInput
                                text="Hours" 
                                height="2.5vh"
                                width="5vw"
                                {...field} 
                            />
                        )}
                    />

                    <Controller
                        name="time_minutes"
                        control={control}
                        render={({ field }) => (
                            <ShortTextInput
                                text="Minutes" 
                                height="2.5vh"
                                width="5vw"
                                {...field}
                            />
                        )}
                    />

                    <Controller
                        name="time_seconds"
                        control={control}
                        render={({ field }) => (
                            <ShortTextInput
                                text="seconds" 
                                height="2.5vh"
                                width="5vw"
                                {...field}
                            />
                        )}
                    />
                </div>

                <div className={styles["form-submit"]} style={{display: 'block', margin: 'auto 0', marginLeft: "7.5%"}}>
                    <Button text="Add Time" type="submit"  height="2.5vh" />
                </div>
            </form>
        </>
    )
}

export default AddEntry;