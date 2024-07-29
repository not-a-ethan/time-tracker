import { useForm, Controller } from 'react-hook-form';

import { toast } from "sonner"

import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"

import apiReqeusts from "../../../utils/apiRequest";

import styles from "./styles/newProject.module.css"

function NewProject() {
    const createOnSubmitHandler = (endpoint: string, event: any) => {
        const values: any = {};
        
        for (let i = 0; i < event.target.length; i++) {
            const element = event.target[i];

            if (element.name && element.value) {
                values[element.name] = element.value;
            }
        }

        if (values["newProject"] === "" || values["newProject"] === undefined || values["newProject"] === null) {
            toast.error("Project name is invalid")
            return (SubmitEvent: any) => SubmitEvent.preventDefault();
        }
        
        apiReqeusts(endpoint, values)
    
        return (SubmitEvent: any) => SubmitEvent.preventDefault();
    }

    const { handleSubmit, control } = useForm();

    return (
        <>
            <iframe name="dummyframe" id="dummyframe" className={styles.iframe}></iframe>

            <form target="dummyframe" className={styles.form} onSubmit={(e) => handleSubmit(createOnSubmitHandler('/api/project/new', e))}>
                <Controller
                    name="newProject"
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

                <Button type="submit" name="newProject" className={styles["form-submit"]}>
                    Create Project
                </Button>
            </form>
        </>
    )
}

export default NewProject;