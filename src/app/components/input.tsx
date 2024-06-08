'use client'

import styles from "./css/input.module.css";

interface ShortTextInputProps {
    text: string;
    height: string;
    width: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    value: string;
}

function ShortTextInput({ text, height, width, onChange, onBlur, value }: ShortTextInputProps) {
    return (
        <input 
        type="text" 
        name={text} 
        placeholder={text} 
        style={{height: height, width: width}} 
        className={styles["short-input"]} 
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        />
    );
}

export default ShortTextInput;