function ShortTextInput(props: any) {
    const text = props.text;
    const height = props.height;

    return (
        <input type="text" name={text} placeholder={text} style={{height: height}} />
    );
}