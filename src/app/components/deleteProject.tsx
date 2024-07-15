import { useForm, Controller } from 'react-hook-form';

import apiReqeusts from "../../../utils/apiRequest";

import Button from "../../components/button"
import ShortTextInput  from '../../components/input'

import styles from "./styles/deleteProject.module.css"

function DeleteProject() {
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
            <iframe name="dummyframe2" id="dummyframe" className={styles.iframe}></iframe>

            <form target="dummyframe2" className={styles.form} onSubmit={(e) => handleSubmit(createOnSubmitHandler('/api/project/remove', e))}>
                <Controller
                    name="deleteSlug"
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

                <Button text="Delete Project" type="submit" className={styles["form-submit"]} height="2.5vh" />
            </form>
        </>
    )
}

export default DeleteProject;