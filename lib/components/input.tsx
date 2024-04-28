import styles from "../../styles/input.module.css";

function ShortTextInput(props: any) {
    const text = props.text;
    const height = props.height;

    return (
        <input type="text" name={text} placeholder={text} style={{height: height}} className={styles["short-input"]} />
    );
}

export default ShortTextInput;