import styles from "../../styles/input.module.css";

function ShortTextInput(props: any) {
    const text = props.text;
    const slug = props.slug;

    const height = props.height;
    const width = props.width;

    return (
        <input type="text" name={slug} placeholder={text} style={{height: height, width: width}} className={styles["short-input"]} />
    );
}

export default ShortTextInput;