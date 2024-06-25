'use client'

import React from 'react'

import styles from "./css/input.module.css";

interface ShortTextInputProps {
    text: string;
    name: string;
    height: string;
    width: string;
}

const ShortTextInput = React.forwardRef<HTMLInputElement, ShortTextInputProps>(
    ({ text, name, height, width }, ref) => (
      <input 
        type="text" 
        name={name} 
        placeholder={text} 
        style={{height, width}} 
        className={styles["short-input"]} 
        ref={ref}
      />
    )
  );

ShortTextInput.displayName = 'ShortTextInput';

export default ShortTextInput;