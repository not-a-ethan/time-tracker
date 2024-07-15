import { useForm, Controller } from 'react-hook-form';

import apiReqeusts from "../../../utils/apiRequest";

import Button from "../../components/button"
import ShortTextInput  from '../../components/input'

import styles from "./styles/newTimeEntry.module.css"

function NewTimeEntry() {
    const timeEntry = (endpoint: string, data: any) => {
        const seconds = (Number(data["target"][2].value) * 60 * 60) + (Number(data["target"][3].value) * 60) + Number(data["target"][4].value)

        const newData = {
            entryName: data["target"][1].value,
            slug: data["target"][0].value,
            time_seconds: seconds
        }

        apiReqeusts(endpoint, newData)

        return (SubmitEvent: any) => SubmitEvent.preventDefault();
    }

    const createOnSubmitHandler = (endpoint: string, event: any) => {
        const values: any = {};
        
        for (let i = 0; i < event.target.length; i++) {
            const element = event.target[i];
            if (element.name && element.value) {
            values[element.name] = element.value;
            }
        }
        
        apiReqeusts(endpoint, values)
    
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
                            <ShortTextInput
                                text="Project name" 
                                height="2.5vh"
                                width="5vw"
                                {...field} 
                            />
                        )}
                    />

                    <br />

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

export default NewTimeEntry;