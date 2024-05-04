'use client'

import styles from "./button.module.css";

function Button(props: any) {
    const text = props.text;
    const height = props.height;

    return (
      <button className={`${styles.button}`} style={{height: height}}>
        {props.text}
      </button>
    )
}

export default Button;