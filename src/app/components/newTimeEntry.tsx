import { useForm, Controller } from 'react-hook-form';

import { toast } from "sonner"

import apiReqeusts from "../../../utils/apiRequest";
import { isStringNum } from '../../../utils/isStringNum';

import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"

import styles from "./styles/newTimeEntry.module.css"

function NewTimeEntry() {
    const timeEntry = (endpoint: string, data: any) => {
        const slug: string = data["target"][0].value
        const entryName: string = data["target"][1].value
        const hours: string = data["target"][2].value
        const minutes: string = data["target"][3].value
        const secondsAlone: string = data["target"][4].value

        if (slug === "" || slug === undefined || slug === null) {
            toast.error("Slug is invalid")
            return (SubmitEvent: any) => SubmitEvent.preventDefault();
        }

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

        const seconds: Number = (Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(secondsAlone)

        const newData = {
            entryName: `${entryName}`,
            slug: `${slug}`,
            time_seconds: seconds
        }

        apiReqeusts(endpoint, newData)

        return (SubmitEvent: any) => SubmitEvent.preventDefault();
    }

    const { handleSubmit, control } = useForm();

    return (
        <>
            <iframe name="dummyframe3" id="dummyframe" className={styles.iframe}></iframe>

            <form method="POST" target="dummyframe3" className={styles.form} onSubmit={(e) => handleSubmit(timeEntry('/api/time/addEntry', e))}>
                <div className={`${styles["form-input"]}`}>
                    <Controller
                        name="slug"
                        control={control}
                        render={({ field }) => (
                            <Input
                                label="Project name" 
                                width="5vw"
                                {...field}
                                size="sm"
                            />
                        )}
                    />

                    <br />

                    <Controller
                        name="entryName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                label="Entry name" 
                                width="5vw"
                                {...field}
                                size="sm"
                            />
                        )}
                    />

                    <br />

                    <Controller
                    name="time_hours"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Hours" 
                            width="5vw"
                            {...field}
                            size="sm"
                        />
                    )}
                    />

                <Controller
                    name="time_minutes"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Minutes" 
                            width="5vw"
                            {...field}
                            size="sm"
                        />
                    )}
                    />

                <Controller
                    name="time_seconds"
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="seconds" 
                            width="5vw"
                            {...field}
                            size="sm"
                        />
                    )}
                    />
                </div>

                <div className={styles["form-submit"]} style={{display: 'block', margin: 'auto 0', marginLeft: "7.5%"}}>
                    <Button type="submit">
                        Add Time
                    </Button>
                </div>
            </form>
        </>
    )
}

export default NewTimeEntry;